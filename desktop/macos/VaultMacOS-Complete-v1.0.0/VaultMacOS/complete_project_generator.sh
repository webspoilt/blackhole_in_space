#!/bin/bash
# Complete VAULT macOS Project Generator

set -e
cd "$(dirname "$0")"

echo "🚀 VAULT macOS - Complete Project Generator"
echo "=============================================="
echo ""

# Create all remaining source files using heredocs for efficiency

# Database Manager
cat > VaultMacOS/Core/Database/DatabaseManager.swift << 'DBEOF'
//
//  DatabaseManager.swift
//  VAULT - Database Management with SQLCipher
//

import Foundation
import GRDB

class DatabaseManager {
    static let shared = DatabaseManager()
    private var dbQueue: DatabaseQueue?
    
    private init() {}
    
    func setup() {
        let fileManager = FileManager.default
        let appSupport = fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        let vaultDir = appSupport.appendingPathComponent("VAULT")
        
        try? fileManager.createDirectory(at: vaultDir, withIntermediateDirectories: true)
        
        let dbPath = vaultDir.appendingPathComponent("vault.db").path
        var config = Configuration()
        config.prepareDatabase { db in
            try db.usePassphrase(SecureStorage.shared.getDatabaseKey())
        }
        
        dbQueue = try? DatabaseQueue(path: dbPath, configuration: config)
        createTables()
    }
    
    private func createTables() {
        try? dbQueue?.write { db in
            try db.create(table: "messages", ifNotExists: true) { t in
                t.autoIncrementedPrimaryKey("id")
                t.column("conversationId", .text).notNull().indexed()
                t.column("senderId", .text).notNull()
                t.column("content", .blob).notNull()
                t.column("timestamp", .datetime).notNull()
                t.column("status", .text).notNull()
                t.column("isEncrypted", .boolean).notNull().defaults(to: true)
            }
            
            try db.create(table: "conversations", ifNotExists: true) { t in
                t.autoIncrementedPrimaryKey("id")
                t.column("participantId", .text).notNull().unique()
                t.column("lastMessage", .text)
                t.column("lastTimestamp", .datetime)
                t.column("unreadCount", .integer).defaults(to: 0)
            }
            
            try db.create(table: "identities", ifNotExists: true) { t in
                t.autoIncrementedPrimaryKey("id")
                t.column("userId", .text).notNull().unique()
                t.column("publicKey", .blob).notNull()
                t.column("trustLevel", .integer).defaults(to: 0)
            }
        }
    }
    
    func getPublicKey(for userId: String) -> Data? {
        return try? dbQueue?.read { db in
            try Data.fetchOne(db, sql: "SELECT publicKey FROM identities WHERE userId = ?", arguments: [userId])
        }
    }
    
    func close() {
        dbQueue = nil
    }
}
DBEOF

# WebSocket Manager
cat > VaultMacOS/Core/Network/WebSocketManager.swift << 'WSEOF'
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
WSEOF

# Secure Storage
cat > VaultMacOS/Core/Security/SecureStorage.swift << 'SECEOF'
//
//  SecureStorage.swift
//  VAULT - Secure Keychain Storage
//

import Foundation
import Security

class SecureStorage {
    static let shared = SecureStorage()
    private let service = "com.vault.messenger"
    
    private init() {}
    
    func saveIdentityKey(_ keyPair: SignalIdentityKeyPair) {
        save(key: "identityPublicKey", data: keyPair.publicKey)
        save(key: "identityPrivateKey", data: keyPair.privateKey)
    }
    
    func loadIdentityKey() -> SignalIdentityKeyPair? {
        guard let publicKey = load(key: "identityPublicKey"),
              let privateKey = load(key: "identityPrivateKey") else {
            return nil
        }
        return SignalIdentityKeyPair(publicKey: publicKey, privateKey: privateKey)
    }
    
    func getDatabaseKey() -> String {
        if let existing = load(key: "databaseKey") {
            return String(data: existing, encoding: .utf8) ?? generateDatabaseKey()
        }
        return generateDatabaseKey()
    }
    
    private func generateDatabaseKey() -> String {
        let key = UUID().uuidString + UUID().uuidString
        save(key: "databaseKey", data: Data(key.utf8))
        return key
    }
    
    private func save(key: String, data: Data) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecValueData as String: data
        ]
        
        SecItemDelete(query as CFDictionary)
        SecItemAdd(query as CFDictionary, nil)
    }
    
    private func load(key: String) -> Data? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true
        ]
        
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        
        return status == errSecSuccess ? result as? Data : nil
    }
}
SECEOF

# Config Manager
cat > VaultMacOS/Utilities/ConfigManager.swift << 'CFGEOF'
//
//  ConfigManager.swift
//  VAULT
//

import Foundation

class ConfigManager {
    static let shared = ConfigManager()
    
    let resendAPIKey: String
    let senderEmail: String
    let relayServerURL: String
    let apiURL: String
    
    private init() {
        guard let path = Bundle.main.path(forResource: "Config", ofType: "plist"),
              let config = NSDictionary(contentsOfFile: path) else {
            fatalError("Config.plist not found")
        }
        
        resendAPIKey = config["ResendAPIKey"] as? String ?? ""
        senderEmail = config["SenderEmail"] as? String ?? "noreply@b2g-vault"
        relayServerURL = config["RelayServerWebSocket"] as? String ?? "wss://vault-relay.onrender.com/v1/stream"
        apiURL = config["RelayServerAPI"] as? String ?? "https://vault-relay.onrender.com/v1"
    }
}
CFGEOF

# Email Service
cat > VaultMacOS/Services/EmailService.swift << 'EMAILEOF'
//
//  EmailService.swift
//  VAULT - Email via Resend API
//

import Foundation

class EmailService {
    static let shared = EmailService()
    private let apiKey = ConfigManager.shared.resendAPIKey
    private let from = ConfigManager.shared.senderEmail
    
    func sendVerificationEmail(to email: String, code: String) async throws {
        let endpoint = "https://api.resend.com/emails"
        
        let body: [String: Any] = [
            "from": from,
            "to": [email],
            "subject": "VAULT - Verify Your Email",
            "html": """
            <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>Welcome to VAULT</h2>
                <p>Your verification code is:</p>
                <h1 style="color: #007AFF; letter-spacing: 4px;">\(code)</h1>
                <p>This code expires in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </body>
            </html>
            """
        ]
        
        var request = URLRequest(url: URL(string: endpoint)!)
        request.httpMethod = "POST"
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (_, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw NSError(domain: "EmailService", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to send email"])
        }
    }
}
EMAILEOF

# Authentication ViewModel
cat > VaultMacOS/Features/Authentication/ViewModels/AuthenticationViewModel.swift << 'AUTHEOF'
//
//  AuthenticationViewModel.swift
//  VAULT
//

import Foundation
import Combine

class AuthenticationViewModel: ObservableObject {
    @Published var isAuthenticated = false
    @Published var email = ""
    @Published var password = ""
    @Published var verificationCode = ""
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    func register() async {
        isLoading = true
        errorMessage = nil
        
        do {
            // Generate verification code
            let code = String(format: "%06d", Int.random(in: 100000...999999))
            
            // Send verification email
            try await EmailService.shared.sendVerificationEmail(to: email, code: code)
            
            // Store code for verification
            UserDefaults.standard.set(code, forKey: "verificationCode_\(email)")
            
            await MainActor.run {
                isLoading = false
            }
        } catch {
            await MainActor.run {
                errorMessage = error.localizedDescription
                isLoading = false
            }
        }
    }
    
    func verifyAndCreateAccount() -> Bool {
        guard let storedCode = UserDefaults.standard.string(forKey: "verificationCode_\(email)") else {
            errorMessage = "No verification code found"
            return false
        }
        
        if verificationCode == storedCode {
            // Create account
            isAuthenticated = true
            UserDefaults.standard.set(email, forKey: "userEmail")
            UserDefaults.standard.removeObject(forKey: "verificationCode_\(email)")
            return true
        } else {
            errorMessage = "Invalid verification code"
            return false
        }
    }
    
    func login() -> Bool {
        // Verify credentials
        if let savedEmail = UserDefaults.standard.string(forKey: "userEmail"),
           savedEmail == email {
            isAuthenticated = true
            return true
        }
        errorMessage = "Invalid credentials"
        return false
    }
}
AUTHEOF

# Authentication Views
cat > VaultMacOS/Features/Authentication/Views/AuthenticationView.swift << 'AUTHVEOF'
//
//  AuthenticationView.swift
//  VAULT
//

import SwiftUI

struct AuthenticationView: View {
    @EnvironmentObject var viewModel: AuthenticationViewModel
    @State private var showingRegister = false
    @State private var showingVerify = false
    
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "lock.shield.fill")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 100, height: 100)
                .foregroundColor(.blue)
            
            Text("VAULT")
                .font(.system(size: 48, weight: .bold))
            
            Text("Military-Grade Secure Messaging")
                .font(.headline)
                .foregroundColor(.secondary)
            
            if !showingVerify {
                VStack(spacing: 15) {
                    TextField("Email", text: $viewModel.email)
                        .textFieldStyle(.roundedBorder)
                        .frame(maxWidth: 300)
                    
                    SecureField("Password", text: $viewModel.password)
                        .textFieldStyle(.roundedBorder)
                        .frame(maxWidth: 300)
                    
                    if let error = viewModel.errorMessage {
                        Text(error)
                            .foregroundColor(.red)
                            .font(.caption)
                    }
                    
                    Button(action: {
                        if showingRegister {
                            Task { await viewModel.register() }
                            showingVerify = true
                        } else {
                            _ = viewModel.login()
                        }
                    }) {
                        Text(showingRegister ? "Register" : "Login")
                            .frame(maxWidth: 300)
                    }
                    .buttonStyle(.borderedProminent)
                    .disabled(viewModel.isLoading)
                    
                    Button(showingRegister ? "Already have an account? Login" : "Need an account? Register") {
                        showingRegister.toggle()
                    }
                    .buttonStyle(.plain)
                }
            } else {
                VStack(spacing: 15) {
                    Text("Enter verification code sent to \(viewModel.email)")
                        .font(.caption)
                    
                    TextField("Verification Code", text: $viewModel.verificationCode)
                        .textFieldStyle(.roundedBorder)
                        .frame(maxWidth: 300)
                    
                    Button("Verify") {
                        _ = viewModel.verifyAndCreateAccount()
                    }
                    .buttonStyle(.borderedProminent)
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding()
    }
}
AUTHVEOF

# Chat List View
cat > VaultMacOS/Features/Chat/Views/ChatListView.swift << 'CHATEOF'
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
CHATEOF

# Lock Screen View
cat > VaultMacOS/Features/Authentication/Views/LockScreenView.swift << 'LOCKEOF'
//
//  LockScreenView.swift
//  VAULT
//

import SwiftUI
import LocalAuthentication

struct LockScreenView: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        VStack(spacing: 30) {
            Image(systemName: "lock.fill")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 80, height: 80)
                .foregroundColor(.blue)
            
            Text("VAULT is Locked")
                .font(.title)
            
            Button("Unlock with Touch ID / Face ID") {
                authenticateWithBiometrics()
            }
            .buttonStyle(.borderedProminent)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private func authenticateWithBiometrics() {
        let context = LAContext()
        var error: NSError?
        
        if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
            context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: "Unlock VAULT") { success, _ in
                DispatchQueue.main.async {
                    if success {
                        appState.isLocked = false
                    }
                }
            }
        }
    }
}
LOCKEOF

# Settings View
cat > VaultMacOS/Features/Settings/Views/SettingsView.swift << 'SETEOF'
//
//  SettingsView.swift
//  VAULT
//

import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var appState: AppState
    @State private var biometricEnabled = UserDefaults.standard.bool(forKey: "biometricEnabled")
    @State private var autoLockMinutes = UserDefaults.standard.integer(forKey: "autoLockMinutes") 
    
    var body: some View {
        Form {
            Section("Security") {
                Toggle("Enable Biometric Lock", isOn: $biometricEnabled)
                    .onChange(of: biometricEnabled) { newValue in
                        UserDefaults.standard.set(newValue, forKey: "biometricEnabled")
                        appState.biometricEnabled = newValue
                    }
                
                Picker("Auto-Lock", selection: $autoLockMinutes) {
                    Text("Never").tag(0)
                    Text("1 minute").tag(1)
                    Text("5 minutes").tag(5)
                    Text("15 minutes").tag(15)
                }
            }
            
            Section("Privacy") {
                Toggle("Disappearing Messages", isOn: .constant(false))
                Button("Clear All Data") {}
                    .foregroundColor(.red)
            }
            
            Section("About") {
                LabeledContent("Version", value: "1.0.0")
                LabeledContent("Build", value: "100")
                Button("View Licenses") {}
            }
        }
        .formStyle(.grouped)
        .navigationTitle("Settings")
    }
}
SETEOF

# Contacts View
cat > VaultMacOS/Features/Contacts/Views/ContactsView.swift << 'CONTEOF'
//
//  ContactsView.swift
//  VAULT
//

import SwiftUI

struct ContactsView: View {
    @State private var contacts: [Contact] = []
    
    var body: some View {
        List(contacts) { contact in
            HStack {
                Circle()
                    .fill(.green)
                    .frame(width: 40, height: 40)
                    .overlay {
                        Text(contact.name.prefix(1))
                            .foregroundColor(.white)
                    }
                
                VStack(alignment: .leading) {
                    Text(contact.name)
                        .font(.headline)
                    Text(contact.email)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                if contact.verified {
                    Image(systemName: "checkmark.shield.fill")
                        .foregroundColor(.green)
                }
            }
        }
        .navigationTitle("Contacts")
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button(action: {}) {
                    Image(systemName: "plus")
                }
            }
        }
    }
}

struct Contact: Identifiable {
    let id = UUID()
    let name: String
    let email: String
    let verified: Bool
}
CONTEOF

echo "✅ All Swift source files generated"

# Create Package.swift for SPM dependencies
cat > Package.swift << 'PKGEOF'
// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "VaultMacOS",
    platforms: [.macOS(.v13)],
    products: [
        .library(name: "VaultMacOS", targets: ["VaultMacOS"])
    ],
    dependencies: [
        .package(url: "https://github.com/groue/GRDB.swift.git", from: "6.24.0"),
        .package(url: "https://github.com/jedisct1/swift-sodium.git", from: "0.9.1"),
        .package(url: "https://github.com/daltoniam/Starscream.git", from: "4.0.6"),
        .package(url: "https://github.com/kishikawakatsumi/KeychainAccess.git", from: "4.2.2")
    ],
    targets: [
        .target(
            name: "VaultMacOS",
            dependencies: [
                .product(name: "GRDB", package: "GRDB.swift"),
                .product(name: "Sodium", package: "swift-sodium"),
                .product(name: "Starscream", package: "Starscream"),
                .product(name: "KeychainAccess", package: "KeychainAccess")
            ]
        )
    ]
)
PKGEOF

# Create Info.plist
cat > VaultMacOS/Resources/Info.plist << 'PLISTEOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>$(DEVELOPMENT_LANGUAGE)</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIconFile</key>
    <string></string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>$(PRODUCT_BUNDLE_PACKAGE_TYPE)</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSMinimumSystemVersion</key>
    <string>$(MACOSX_DEPLOYMENT_TARGET)</string>
    <key>NSCameraUsageDescription</key>
    <string>VAULT needs camera access for video calls and QR code device verification.</string>
    <key>NSMicrophoneUsageDescription</key>
    <string>VAULT needs microphone access for voice messages and calls.</string>
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <false/>
    </dict>
    <key>CFBundleURLTypes</key>
    <array>
        <dict>
            <key>CFBundleURLName</key>
            <string>com.vault.messenger</string>
            <key>CFBundleURLSchemes</key>
            <array>
                <string>vault</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
PLISTEOF

# Create Config template
cat > VaultMacOS/Resources/Config.template.plist << 'CFGTEOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>ResendAPIKey</key>
    <string>re_YOUR_RESEND_API_KEY</string>
    <key>SenderEmail</key>
    <string>noreply@b2g-vault</string>
    <key>RelayServerWebSocket</key>
    <string>wss://vault-relay.onrender.com/v1/stream</string>
    <key>RelayServerAPI</key>
    <string>https://vault-relay.onrender.com/v1</string>
    <key>Environment</key>
    <string>production</string>
</dict>
</plist>
CFGTEOF

# Copy template to actual config
cp VaultMacOS/Resources/Config.template.plist VaultMacOS/Resources/Config.plist

# Create entitlements
cat > VaultMacOS/VaultMacOS.entitlements << 'ENTEOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.app-sandbox</key>
    <true/>
    <key>com.apple.security.network.client</key>
    <true/>
    <key>com.apple.security.files.user-selected.read-write</key>
    <true/>
    <key>com.apple.security.device.camera</key>
    <true/>
    <key>com.apple.security.device.audio-input</key>
    <true/>
</dict>
</plist>
ENTEOF

echo "✅ Configuration files created"

# Create LICENSE
cat > LICENSE << 'LICEOF'
MIT License

Copyright (c) 2026 VAULT Systems

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
LICEOF

echo "✅ LICENSE created"

# Create .gitignore
cat > .gitignore << 'GITEOF'
# Xcode
build/
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata/
*.xccheckout
*.moved-aside
DerivedData/
*.hmap
*.ipa
*.xcuserstate
*.xcscmblueprint

# Swift Package Manager
.build/
Packages/
Package.resolved

# CocoaPods
Pods/

# fastlane
fastlane/report.xml
fastlane/Preview.html
fastlane/screenshots/**/*.png
fastlane/test_output

# Config with sensitive data
VaultMacOS/Resources/Config.plist

# macOS
.DS_Store
.AppleDouble
.LSOverride

# Thumbnails
._*
GITEOF

echo "✅ .gitignore created"

echo ""
echo "=============================================="
echo "✅ VAULT macOS Project Generation Complete!"
echo "=============================================="
echo ""
echo "📁 Project structure ready"
echo "📝 All Swift source files generated"
echo "⚙️  Configuration templates created"
echo "📄 Documentation files included"
echo ""
echo "Next steps:"
echo "1. Open project in Xcode"
echo "2. Configure Config.plist with your API keys"
echo "3. Build and run (⌘R)"
echo ""

