//
//  ChatView.swift
//  VaultMessenger
//
//  Individual chat conversation view
//

import SwiftUI

struct ChatView: View {
    let conversation: Conversation
    
    @StateObject private var viewModel: ChatViewModel
    @State private var messageText = ""
    @State private var showingAttachments = false
    @FocusState private var isInputFocused: Bool
    
    init(conversation: Conversation) {
        self.conversation = conversation
        self._viewModel = StateObject(wrappedValue: ChatViewModel(conversation: conversation))
    }
    
    var body: some View {
        ZStack {
            Color("VaultDark").ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Messages List
                ScrollViewReader { proxy in
                    ScrollView {
                        LazyVStack(spacing: 12) {
                            ForEach(viewModel.messages) { message in
                                MessageBubble(message: message, isFromCurrentUser: message.senderId == viewModel.currentUserId)
                                    .id(message.id)
                            }
                        }
                        .padding()
                    }
                    .onChange(of: viewModel.messages.count) { _ in
                        if let lastMessage = viewModel.messages.last {
                            withAnimation {
                                proxy.scrollTo(lastMessage.id, anchor: .bottom)
                            }
                        }
                    }
                }
                
                // Input Bar
                MessageInputBar(
                    text: $messageText,
                    isInputFocused: $isInputFocused,
                    onSend: sendMessage,
                    onAttachment: { showingAttachments = true }
                )
            }
        }
        .navigationTitle(conversation.title ?? "Chat")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button(action: { /* Show conversation info */ }) {
                    Image(systemName: "info.circle")
                        .foregroundColor(.white)
                }
            }
        }
        .sheet(isPresented: $showingAttachments) {
            AttachmentPicker()
        }
        .onAppear {
            viewModel.loadMessages()
            viewModel.markAsRead()
        }
    }
    
    func sendMessage() {
        guard !messageText.isEmpty else { return }
        
        let text = messageText
        messageText = ""
        
        Task {
            await viewModel.sendMessage(text: text)
        }
    }
}

// MARK: - Message Bubble
struct MessageBubble: View {
    let message: Message
    let isFromCurrentUser: Bool
    
    var body: some View {
        HStack {
            if isFromCurrentUser { Spacer() }
            
            VStack(alignment: isFromCurrentUser ? .trailing : .leading, spacing: 4) {
                // Message content
                Text(message.decryptedContent ?? "🔒 Decrypting...")
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                    .background(
                        isFromCurrentUser ?
                        LinearGradient(
                            colors: [Color("VaultPurple"), .cyan],
                            startPoint: .leading,
                            endPoint: .trailing
                        ) :
                        LinearGradient(
                            colors: [Color.white.opacity(0.15), Color.white.opacity(0.1)],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .foregroundColor(.white)
                    .cornerRadius(18)
                
                // Timestamp and status
                HStack(spacing: 4) {
                    Text(message.timestamp.formatted(date: .omitted, time: .shortened))
                        .font(.caption2)
                        .foregroundColor(.white.opacity(0.5))
                    
                    if isFromCurrentUser {
                        MessageStatusIcon(status: message.status)
                    }
                    
                    // Expiry indicator
                    if let expiresAt = message.expiresAt {
                        HStack(spacing: 2) {
                            Image(systemName: "timer")
                            Text(timeRemaining(until: expiresAt))
                        }
                        .font(.caption2)
                        .foregroundColor(.orange)
                    }
                }
                .padding(.horizontal, 4)
            }
            
            if !isFromCurrentUser { Spacer() }
        }
    }
    
    func timeRemaining(until date: Date) -> String {
        let remaining = date.timeIntervalSinceNow
        let minutes = Int(remaining / 60)
        return "\(minutes)m"
    }
}

// MARK: - Message Status Icon
struct MessageStatusIcon: View {
    let status: Message.MessageStatus
    
    var body: some View {
        Group {
            switch status {
            case .sending:
                ProgressView()
                    .scaleEffect(0.5)
            case .sent:
                Image(systemName: "checkmark")
            case .delivered:
                Image(systemName: "checkmark.circle")
            case .read:
                Image(systemName: "checkmark.circle.fill")
            case .failed:
                Image(systemName: "exclamationmark.circle")
            }
        }
        .font(.caption2)
        .foregroundColor(.white.opacity(0.7))
    }
}

// MARK: - Message Input Bar
struct MessageInputBar: View {
    @Binding var text: String
    var isInputFocused: FocusState<Bool>.Binding
    let onSend: () -> Void
    let onAttachment: () -> Void
    
    var body: some View {
        HStack(spacing: 12) {
            // Attachment button
            Button(action: onAttachment) {
                Image(systemName: "plus.circle.fill")
                    .font(.title2)
                    .foregroundColor(Color("VaultPurple"))
            }
            
            // Text field
            HStack {
                TextField("Message", text: $text, axis: .vertical)
                    .focused(isInputFocused)
                    .foregroundColor(.white)
                    .lineLimit(1...5)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color.white.opacity(0.1))
            .cornerRadius(20)
            
            // Send button
            Button(action: onSend) {
                Image(systemName: "arrow.up.circle.fill")
                    .font(.title2)
                    .foregroundColor(text.isEmpty ? .gray : Color("VaultPurple"))
            }
            .disabled(text.isEmpty)
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
        .background(Color("VaultDark"))
    }
}

// MARK: - Chat View Model
class ChatViewModel: ObservableObject {
    let conversation: Conversation
    let currentUserId: String
    
    @Published var messages: [Message] = []
    @Published var isLoading = false
    
    private let cryptoService = CryptoService.shared
    private let networkService = NetworkService.shared
    
    init(conversation: Conversation) {
        self.conversation = conversation
        self.currentUserId = SecureStorage.getUserId() ?? ""
    }
    
    func loadMessages() {
        isLoading = true
        
        // Load messages from local storage
        // TODO: Implement actual loading and decryption
        
        Task {
            await MainActor.run {
                isLoading = false
            }
        }
    }
    
    func sendMessage(text: String) async {
        // Get recipient info
        guard let recipientId = conversation.participantIds.first(where: { $0 != currentUserId }) else {
            return
        }
        
        // Create message
        let message = Message(
            conversationId: conversation.id,
            senderId: currentUserId,
            recipientId: recipientId,
            content: text,
            expiryMinutes: 1440 // 24 hours default
        )
        
        // Add to local list immediately
        await MainActor.run {
            messages.append(message)
        }
        
        do {
            // Encrypt and send
            guard let recipientPublicKey = getRecipientPublicKey(recipientId) else {
                throw ChatError.recipientKeyNotFound
            }
            
            let encryptedContent = try await cryptoService.encrypt(
                message: text,
                for: recipientPublicKey
            )
            
            // Send via network
            let outgoingMessage = OutgoingMessage(
                recipientId: recipientId,
                recipientPublicKey: recipientPublicKey,
                content: encryptedContent.base64EncodedString()
            )
            
            try await networkService.send(outgoingMessage)
            
            // Update message status
            await MainActor.run {
                if let index = messages.firstIndex(where: { $0.id == message.id }) {
                    messages[index].status = .sent
                }
            }
        } catch {
            print("❌ Failed to send message: \(error)")
            await MainActor.run {
                if let index = messages.firstIndex(where: { $0.id == message.id }) {
                    messages[index].status = .failed
                }
            }
        }
    }
    
    func markAsRead() {
        // Mark all messages as read
        Task {
            for message in messages where !message.isRead {
                // Update locally and notify server
            }
        }
    }
    
    private func getRecipientPublicKey(_ recipientId: String) -> Data? {
        // TODO: Fetch from contacts or server
        return nil
    }
}

enum ChatError: Error {
    case recipientKeyNotFound
    case encryptionFailed
    case sendingFailed
}

// MARK: - Attachment Picker
struct AttachmentPicker: View {
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationStack {
            List {
                Button(action: { /* Photo library */ }) {
                    Label("Photo or Video", systemImage: "photo")
                }
                
                Button(action: { /* Camera */ }) {
                    Label("Camera", systemImage: "camera")
                }
                
                Button(action: { /* Document */ }) {
                    Label("Document", systemImage: "doc")
                }
                
                Button(action: { /* Location */ }) {
                    Label("Location", systemImage: "location")
                }
            }
            .navigationTitle("Send Attachment")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }
}

// MARK: - New Message View
struct NewMessageView: View {
    @Environment(\.dismiss) var dismiss
    @State private var searchText = ""
    
    var body: some View {
        NavigationStack {
            VStack {
                SearchBar(text: $searchText)
                    .padding()
                
                List {
                    // TODO: Show contacts list
                }
            }
            .background(Color("VaultDark"))
            .navigationTitle("New Message")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }
}

#Preview {
    NavigationStack {
        ChatView(conversation: Conversation(participantIds: ["user1", "user2"]))
    }
}
