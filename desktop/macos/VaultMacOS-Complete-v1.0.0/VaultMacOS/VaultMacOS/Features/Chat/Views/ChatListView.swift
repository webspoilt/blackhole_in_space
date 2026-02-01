//
//  ChatListView.swift
//  VAULT
//

import SwiftUI

struct ChatListView: View {
    @State private var conversations: [Conversation] = []
    @State private var searchText = ""
    
    var body: some View {
        VStack {
            HStack {
                Image(systemName: "magnifyingglass")
                TextField("Search conversations", text: $searchText)
            }
            .padding()
            
            List(conversations) { conversation in
                ConversationRow(conversation: conversation)
            }
            .listStyle(.inset)
        }
        .navigationTitle("Chats")
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button(action: {}) {
                    Image(systemName: "square.and.pencil")
                }
            }
        }
    }
}

struct Conversation: Identifiable {
    let id = UUID()
    let participantName: String
    let lastMessage: String
    let timestamp: Date
    let unreadCount: Int
}

struct ConversationRow: View {
    let conversation: Conversation
    
    var body: some View {
        HStack {
            Circle()
                .fill(.blue)
                .frame(width: 50, height: 50)
                .overlay {
                    Text(conversation.participantName.prefix(1))
                        .foregroundColor(.white)
                        .font(.title2)
                }
            
            VStack(alignment: .leading) {
                Text(conversation.participantName)
                    .font(.headline)
                Text(conversation.lastMessage)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .lineLimit(1)
            }
            
            Spacer()
            
            VStack(alignment: .trailing) {
                Text(conversation.timestamp, style: .time)
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                if conversation.unreadCount > 0 {
                    Text("\(conversation.unreadCount)")
                        .font(.caption)
                        .padding(4)
                        .background(.blue)
                        .foregroundColor(.white)
                        .clipShape(Circle())
                }
            }
        }
        .padding(.vertical, 4)
    }
}
