//
//  ContactsView.swift
//  VaultMessenger
//
//  Contacts management view
//

import SwiftUI

struct ContactsView: View {
    @StateObject private var viewModel = ContactsViewModel()
    @State private var showingAddContact = false
    @State private var searchText = ""
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color("VaultDark").ignoresSafeArea()
                
                VStack {
                    SearchBar(text: $searchText)
                        .padding()
                    
                    if viewModel.contacts.isEmpty {
                        ContactsEmptyState()
                    } else {
                        List {
                            ForEach(filteredContacts) { contact in
                                ContactRow(contact: contact)
                                    .listRowBackground(Color.clear)
                            }
                        }
                        .listStyle(.plain)
                        .scrollContentBackground(.hidden)
                    }
                }
            }
            .navigationTitle("Contacts")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showingAddContact = true }) {
                        Image(systemName: "person.badge.plus")
                            .foregroundColor(.white)
                    }
                }
            }
            .sheet(isPresented: $showingAddContact) {
                AddContactView()
            }
        }
        .onAppear {
            viewModel.loadContacts()
        }
    }
    
    var filteredContacts: [Contact] {
        if searchText.isEmpty {
            return viewModel.contacts
        } else {
            return viewModel.contacts.filter {
                $0.displayName.localizedCaseInsensitiveContains(searchText) ||
                $0.username.localizedCaseInsensitiveContains(searchText)
            }
        }
    }
}

// MARK: - Contact Row
struct ContactRow: View {
    let contact: Contact
    
    var body: some View {
        HStack(spacing: 15) {
            // Avatar
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color("VaultPurple"), .cyan],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 50, height: 50)
                
                Text(contact.displayName.prefix(1).uppercased())
                    .font(.title3)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
            }
            
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(contact.displayName)
                        .font(.headline)
                        .foregroundColor(.white)
                    
                    if contact.isVerified {
                        Image(systemName: "checkmark.seal.fill")
                            .font(.caption)
                            .foregroundColor(.green)
                    }
                }
                
                Text("@\(contact.username)")
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.6))
            }
            
            Spacer()
            
            Button(action: { /* Start chat */ }) {
                Image(systemName: "message.fill")
                    .foregroundColor(Color("VaultPurple"))
            }
        }
        .padding(.vertical, 8)
    }
}

// MARK: - Empty State
struct ContactsEmptyState: View {
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "person.2.fill")
                .font(.system(size: 80))
                .foregroundColor(.white.opacity(0.3))
            
            Text("No Contacts Yet")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(.white)
            
            Text("Add contacts to start secure conversations")
                .font(.subheadline)
                .foregroundColor(.white.opacity(0.6))
                .multilineTextAlignment(.center)
                .padding(.horizontal)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// MARK: - Add Contact View
struct AddContactView: View {
    @Environment(\.dismiss) var dismiss
    @State private var username = ""
    @State private var isSearching = false
    @State private var foundUser: User?
    @State private var errorMessage: String?
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color("VaultDark").ignoresSafeArea()
                
                VStack(spacing: 20) {
                    // Search field
                    HStack {
                        Image(systemName: "at")
                            .foregroundColor(.white.opacity(0.6))
                        
                        TextField("Username", text: $username)
                            .foregroundColor(.white)
                            .textInputAutocapitalization(.never)
                            .autocorrectionDisabled()
                        
                        if isSearching {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        }
                    }
                    .padding()
                    .background(Color.white.opacity(0.1))
                    .cornerRadius(12)
                    .padding(.horizontal)
                    
                    // Search button
                    Button(action: searchUser) {
                        Text("Search")
                            .fontWeight(.bold)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color("VaultPurple"))
                            .foregroundColor(.white)
                            .cornerRadius(12)
                    }
                    .padding(.horizontal)
                    .disabled(username.isEmpty || isSearching)
                    
                    // Results
                    if let user = foundUser {
                        UserResultCard(user: user, onAdd: {
                            addContact(user)
                        })
                        .padding()
                    }
                    
                    if let error = errorMessage {
                        Text(error)
                            .font(.caption)
                            .foregroundColor(.red)
                            .padding()
                    }
                    
                    Spacer()
                }
                .padding(.top)
            }
            .navigationTitle("Add Contact")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .foregroundColor(.white)
                }
            }
        }
    }
    
    func searchUser() {
        isSearching = true
        errorMessage = nil
        foundUser = nil
        
        Task {
            do {
                // Search for user on server
                foundUser = try await ContactService.searchUser(username: username)
                await MainActor.run {
                    isSearching = false
                }
            } catch {
                await MainActor.run {
                    errorMessage = "User not found"
                    isSearching = false
                }
            }
        }
    }
    
    func addContact(_ user: User) {
        Task {
            do {
                try await ContactService.addContact(user: user)
                await MainActor.run {
                    dismiss()
                }
            } catch {
                await MainActor.run {
                    errorMessage = "Failed to add contact"
                }
            }
        }
    }
}

// MARK: - User Result Card
struct UserResultCard: View {
    let user: User
    let onAdd: () -> Void
    
    var body: some View {
        VStack(spacing: 15) {
            // Avatar
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color("VaultPurple"), .cyan],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 80, height: 80)
                
                Text(user.displayName.prefix(1).uppercased())
                    .font(.system(size: 36))
                    .fontWeight(.bold)
                    .foregroundColor(.white)
            }
            
            Text(user.displayName)
                .font(.title3)
                .fontWeight(.bold)
                .foregroundColor(.white)
            
            Text("@\(user.username)")
                .font(.subheadline)
                .foregroundColor(.white.opacity(0.6))
            
            // Fingerprint
            VStack(spacing: 8) {
                Text("Identity Key")
                    .font(.caption)
                    .foregroundColor(.white.opacity(0.6))
                
                Text(CryptoUtils.formatFingerprint(user.publicKey))
                    .font(.system(.caption, design: .monospaced))
                    .foregroundColor(.white.opacity(0.8))
                    .padding(8)
                    .background(Color.white.opacity(0.05))
                    .cornerRadius(8)
            }
            
            Button(action: onAdd) {
                Text("Add Contact")
                    .fontWeight(.bold)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(
                        LinearGradient(
                            colors: [Color("VaultPurple"), .cyan],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .foregroundColor(.white)
                    .cornerRadius(12)
            }
        }
        .padding()
        .background(Color.white.opacity(0.05))
        .cornerRadius(16)
    }
}

// MARK: - Contacts View Model
class ContactsViewModel: ObservableObject {
    @Published var contacts: [Contact] = []
    @Published var isLoading = false
    
    func loadContacts() {
        isLoading = true
        
        Task {
            // Load from local storage and sync with server
            // TODO: Implement actual loading
            
            await MainActor.run {
                isLoading = false
            }
        }
    }
}

// MARK: - Contact Service
class ContactService {
    static func searchUser(username: String) async throws -> User {
        var request = URLRequest(url: URL(string: "https://b2g-vault.vercel.app/api/users/search")!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let token = SecureStorage.getAuthToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        let body: [String: String] = ["username": username]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw ContactError.userNotFound
        }
        
        let user = try JSONDecoder().decode(User.self, from: data)
        return user
    }
    
    static func addContact(user: User) async throws {
        // Add contact locally and notify server
        let contact = Contact(user: user)
        
        // Save locally
        // TODO: Implement local storage
        
        // Notify server
        var request = URLRequest(url: URL(string: "https://b2g-vault.vercel.app/api/contacts")!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let token = SecureStorage.getAuthToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        let body: [String: String] = ["userId": user.id]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (_, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw ContactError.addFailed
        }
    }
}

enum ContactError: Error {
    case userNotFound
    case addFailed
}

// MARK: - Crypto Utils
class CryptoUtils {
    static func generateFingerprint(publicKey: String) -> String {
        guard let keyData = Data(base64Encoded: publicKey) else {
            return "Invalid key"
        }
        
        // Generate SHA-256 hash
        let hash = SHA256.hash(data: keyData)
        return formatFingerprint(hash.compactMap { String(format: "%02x", $0) }.joined())
    }
    
    static func formatFingerprint(_ fingerprint: String) -> String {
        // Format as: XXXX XXXX XXXX XXXX
        let chunks = stride(from: 0, to: min(fingerprint.count, 16), by: 4).map {
            String(fingerprint.dropFirst($0).prefix(4))
        }
        return chunks.joined(separator: " ").uppercased()
    }
}

import CryptoKit

#Preview {
    ContactsView()
}
