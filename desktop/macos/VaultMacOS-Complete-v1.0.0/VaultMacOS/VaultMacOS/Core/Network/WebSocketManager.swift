//
//  WebSocketManager.swift
//  VAULT - WebSocket Communication
//

import Foundation
import Starscream

class WebSocketManager: WebSocketDelegate {
    static let shared = WebSocketManager()
    private var socket: WebSocket?
    private var isConnected = false
    
    private init() {}
    
    func connect() {
        guard let url = URL(string: ConfigManager.shared.relayServerURL) else { return }
        
        var request = URLRequest(url: url)
        request.timeoutInterval = 5
        
        socket = WebSocket(request: request)
        socket?.delegate = self
        socket?.connect()
    }
    
    func disconnect() {
        socket?.disconnect()
        isConnected = false
    }
    
    func send(message: Data) {
        socket?.write(data: message)
    }
    
    // MARK: - WebSocketDelegate
    
    func didReceive(event: WebSocketEvent, client: WebSocketClient) {
        switch event {
        case .connected:
            isConnected = true
            print("✅ Connected to relay server")
            
        case .disconnected(let reason, let code):
            isConnected = false
            print("❌ Disconnected: \(reason) Code: \(code)")
            
        case .text(let string):
            handleTextMessage(string)
            
        case .binary(let data):
            handleBinaryMessage(data)
            
        case .error(let error):
            print("⚠️ WebSocket error: \(error?.localizedDescription ?? "Unknown")")
            
        default:
            break
        }
    }
    
    private func handleTextMessage(_ text: String) {
        // Handle JSON messages
    }
    
    private func handleBinaryMessage(_ data: Data) {
        // Handle encrypted message data
        NotificationCenter.default.post(name: .newEncryptedMessage, object: data)
    }
}

extension Notification.Name {
    static let newEncryptedMessage = Notification.Name("newEncryptedMessage")
}
