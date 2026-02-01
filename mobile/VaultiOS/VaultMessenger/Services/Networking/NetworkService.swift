//
//  NetworkService.swift
//  VaultMessenger
//
//  WebSocket networking for real-time messaging
//

import Foundation
import Combine
import Network

class NetworkService: NSObject, ObservableObject {
    static let shared = NetworkService()
    
    @Published var connectionState: ConnectionState = .disconnected
    @Published var isConnected = false
    
    private var webSocket: URLSessionWebSocketTask?
    private var session: URLSession?
    private let serverURL: URL
    private var reconnectTimer: Timer?
    private var heartbeatTimer: Timer?
    private var messageQueue: [OutgoingMessage] = []
    
    private let messageSubject = PassthroughSubject<ServerMessage, Never>()
    var messagePublisher: AnyPublisher<ServerMessage, Never> {
        messageSubject.eraseToAnyPublisher()
    }
    
    enum ConnectionState {
        case disconnected
        case connecting
        case connected
        case reconnecting
        case error(String)
    }
    
    private override init() {
        // WebSocket server URL (from environment or config)
        if let urlString = Bundle.main.object(forInfoDictionaryKey: "VAULT_SERVER_URL") as? String,
           let url = URL(string: urlString) {
            self.serverURL = url
        } else {
            // Default development server
            self.serverURL = URL(string: "wss://b2g-vault.vercel.app/ws")!
        }
        
        super.init()
        setupSession()
    }
    
    // MARK: - Connection Management
    private func setupSession() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        config.timeoutIntervalForResource = 300
        config.waitsForConnectivity = true
        
        // Certificate pinning
        let delegate = NetworkSessionDelegate()
        session = URLSession(configuration: config, delegate: delegate, delegateQueue: nil)
    }
    
    func connect() async {
        guard connectionState != .connected && connectionState != .connecting else { return }
        
        await MainActor.run {
            connectionState = .connecting
        }
        
        guard let session = session else {
            await MainActor.run {
                connectionState = .error("Session not initialized")
            }
            return
        }
        
        // Create WebSocket connection with Noise Protocol
        var request = URLRequest(url: serverURL)
        request.timeoutInterval = 30
        
        // Add authentication headers
        if let token = SecureStorage.getAuthToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        webSocket = session.webSocketTask(with: request)
        webSocket?.resume()
        
        await MainActor.run {
            connectionState = .connected
            isConnected = true
        }
        
        // Start receiving messages
        receiveMessage()
        
        // Start heartbeat
        startHeartbeat()
        
        // Send queued messages
        await sendQueuedMessages()
    }
    
    func disconnect() {
        heartbeatTimer?.invalidate()
        heartbeatTimer = nil
        
        webSocket?.cancel(with: .goingAway, reason: nil)
        webSocket = nil
        
        connectionState = .disconnected
        isConnected = false
    }
    
    private func reconnect() {
        disconnect()
        
        connectionState = .reconnecting
        
        // Exponential backoff
        reconnectTimer?.invalidate()
        reconnectTimer = Timer.scheduledTimer(withTimeInterval: 5.0, repeats: false) { [weak self] _ in
            Task {
                await self?.connect()
            }
        }
    }
    
    // MARK: - Message Handling
    private func receiveMessage() {
        webSocket?.receive { [weak self] result in
            guard let self = self else { return }
            
            switch result {
            case .success(let message):
                self.handleMessage(message)
                // Continue receiving
                self.receiveMessage()
                
            case .failure(let error):
                print("❌ WebSocket receive error: \(error)")
                DispatchQueue.main.async {
                    self.connectionState = .error(error.localizedDescription)
                    self.isConnected = false
                }
                self.reconnect()
            }
        }
    }
    
    private func handleMessage(_ message: URLSessionWebSocketTask.Message) {
        switch message {
        case .string(let text):
            handleTextMessage(text)
            
        case .data(let data):
            handleBinaryMessage(data)
            
        @unknown default:
            break
        }
    }
    
    private func handleTextMessage(_ text: String) {
        guard let data = text.data(using: .utf8) else { return }
        
        do {
            let serverMessage = try JSONDecoder().decode(ServerMessage.self, from: data)
            messageSubject.send(serverMessage)
        } catch {
            print("❌ Failed to decode message: \(error)")
        }
    }
    
    private func handleBinaryMessage(_ data: Data) {
        // Handle encrypted binary messages
        Task {
            do {
                // Decrypt message using CryptoService
                let decryptedData = try await CryptoService.shared.decrypt(
                    ciphertext: data,
                    from: Data() // Sender's public key from message header
                )
                
                if let messageString = String(data: Data(decryptedData.utf8), encoding: .utf8) {
                    handleTextMessage(messageString)
                }
            } catch {
                print("❌ Failed to decrypt binary message: \(error)")
            }
        }
    }
    
    // MARK: - Sending Messages
    func send(_ message: OutgoingMessage) async throws {
        guard isConnected else {
            // Queue message for later
            messageQueue.append(message)
            return
        }
        
        // Serialize and encrypt message
        let jsonData = try JSONEncoder().encode(message)
        
        // Encrypt with recipient's public key
        let encryptedData = try await CryptoService.shared.encrypt(
            message: String(data: jsonData, encoding: .utf8) ?? "",
            for: message.recipientPublicKey
        )
        
        // Send via WebSocket
        let wsMessage = URLSessionWebSocketTask.Message.data(encryptedData)
        
        try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Void, Error>) in
            webSocket?.send(wsMessage) { error in
                if let error = error {
                    continuation.resume(throwing: error)
                } else {
                    continuation.resume()
                }
            }
        }
    }
    
    private func sendQueuedMessages() async {
        for message in messageQueue {
            do {
                try await send(message)
            } catch {
                print("❌ Failed to send queued message: \(error)")
            }
        }
        messageQueue.removeAll()
    }
    
    // MARK: - Heartbeat
    private func startHeartbeat() {
        heartbeatTimer?.invalidate()
        heartbeatTimer = Timer.scheduledTimer(withTimeInterval: 30.0, repeats: true) { [weak self] _ in
            self?.sendPing()
        }
    }
    
    private func sendPing() {
        webSocket?.sendPing { error in
            if let error = error {
                print("❌ Ping failed: \(error)")
            }
        }
    }
}

// MARK: - Network Session Delegate
class NetworkSessionDelegate: NSObject, URLSessionDelegate {
    func urlSession(
        _ session: URLSession,
        didReceive challenge: URLAuthenticationChallenge,
        completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void
    ) {
        // Certificate pinning
        guard challenge.protectionSpace.authenticationMethod == NSURLAuthenticationMethodServerTrust,
              let serverTrust = challenge.protectionSpace.serverTrust else {
            completionHandler(.cancelAuthenticationChallenge, nil)
            return
        }
        
        // Verify certificate
        if CertificatePinner.verify(serverTrust: serverTrust, for: challenge.protectionSpace.host) {
            completionHandler(.useCredential, URLCredential(trust: serverTrust))
        } else {
            completionHandler(.cancelAuthenticationChallenge, nil)
        }
    }
}

// MARK: - Message Models
struct ServerMessage: Codable {
    let type: MessageType
    let payload: Data
    let timestamp: Date
    
    enum MessageType: String, Codable {
        case message
        case typing
        case read
        case delivered
        case presence
        case ack
    }
}

struct OutgoingMessage: Codable {
    let type: String
    let recipientId: String
    let recipientPublicKey: Data
    let content: String
    let timestamp: Date
    let messageId: String
    
    init(recipientId: String, recipientPublicKey: Data, content: String) {
        self.type = "message"
        self.recipientId = recipientId
        self.recipientPublicKey = recipientPublicKey
        self.content = content
        self.timestamp = Date()
        self.messageId = UUID().uuidString
    }
}
