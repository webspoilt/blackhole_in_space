//
//  SettingsView.swift
//  VaultMessenger
//
//  App settings and configuration
//

import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var appState: AppState
    @State private var showingLogoutAlert = false
    @State private var biometricEnabled = true
    @State private var autoDeleteEnabled = true
    @State private var defaultExpiryHours = 24.0
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color("VaultDark").ignoresSafeArea()
                
                List {
                    // Profile Section
                    Section {
                        HStack(spacing: 15) {
                            ZStack {
                                Circle()
                                    .fill(
                                        LinearGradient(
                                            colors: [Color("VaultPurple"), .cyan],
                                            startPoint: .topLeading,
                                            endPoint: .bottomTrailing
                                        )
                                    )
                                    .frame(width: 60, height: 60)
                                
                                if let user = appState.currentUser {
                                    Text(user.displayName.prefix(1).uppercased())
                                        .font(.title)
                                        .fontWeight(.bold)
                                        .foregroundColor(.white)
                                }
                            }
                            
                            VStack(alignment: .leading, spacing: 4) {
                                if let user = appState.currentUser {
                                    Text(user.displayName)
                                        .font(.headline)
                                        .foregroundColor(.white)
                                    
                                    Text("@\(user.username)")
                                        .font(.subheadline)
                                        .foregroundColor(.white.opacity(0.6))
                                }
                            }
                        }
                        .padding(.vertical, 8)
                    }
                    .listRowBackground(Color.white.opacity(0.05))
                    
                    // Security Section
                    Section("Security") {
                        Toggle(isOn: $biometricEnabled) {
                            Label("Biometric Lock", systemImage: "faceid")
                                .foregroundColor(.white)
                        }
                        .tint(Color("VaultPurple"))
                        
                        NavigationLink(destination: SecurityKeysView()) {
                            Label("Identity Keys", systemImage: "key.fill")
                                .foregroundColor(.white)
                        }
                        
                        NavigationLink(destination: BackupView()) {
                            Label("Backup & Restore", systemImage: "icloud.fill")
                                .foregroundColor(.white)
                        }
                    }
                    .listRowBackground(Color.white.opacity(0.05))
                    
                    // Privacy Section
                    Section("Privacy") {
                        Toggle(isOn: $autoDeleteEnabled) {
                            Label("Auto-Delete Messages", systemImage: "timer")
                                .foregroundColor(.white)
                        }
                        .tint(Color("VaultPurple"))
                        
                        if autoDeleteEnabled {
                            VStack(alignment: .leading, spacing: 8) {
                                HStack {
                                    Text("Default Expiry")
                                        .foregroundColor(.white)
                                    Spacer()
                                    Text("\(Int(defaultExpiryHours)) hours")
                                        .foregroundColor(.white.opacity(0.6))
                                }
                                
                                Slider(value: $defaultExpiryHours, in: 1...168, step: 1)
                                    .tint(Color("VaultPurple"))
                            }
                        }
                        
                        NavigationLink(destination: BlockedUsersView()) {
                            Label("Blocked Users", systemImage: "hand.raised.fill")
                                .foregroundColor(.white)
                        }
                    }
                    .listRowBackground(Color.white.opacity(0.05))
                    
                    // Notifications Section
                    Section("Notifications") {
                        NavigationLink(destination: NotificationSettingsView()) {
                            Label("Notification Settings", systemImage: "bell.fill")
                                .foregroundColor(.white)
                        }
                    }
                    .listRowBackground(Color.white.opacity(0.05))
                    
                    // About Section
                    Section("About") {
                        NavigationLink(destination: AboutView()) {
                            Label("About VAULT", systemImage: "info.circle")
                                .foregroundColor(.white)
                        }
                        
                        NavigationLink(destination: PrivacyPolicyView()) {
                            Label("Privacy Policy", systemImage: "doc.text")
                                .foregroundColor(.white)
                        }
                        
                        HStack {
                            Text("Version")
                                .foregroundColor(.white)
                            Spacer()
                            Text(getAppVersion())
                                .foregroundColor(.white.opacity(0.6))
                        }
                    }
                    .listRowBackground(Color.white.opacity(0.05))
                    
                    // Danger Zone
                    Section {
                        Button(action: { showingLogoutAlert = true }) {
                            HStack {
                                Spacer()
                                Label("Logout", systemImage: "rectangle.portrait.and.arrow.right")
                                    .foregroundColor(.red)
                                Spacer()
                            }
                        }
                    }
                    .listRowBackground(Color.white.opacity(0.05))
                }
                .listStyle(.insetGrouped)
                .scrollContentBackground(.hidden)
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.large)
            .alert("Logout", isPresented: $showingLogoutAlert) {
                Button("Cancel", role: .cancel) { }
                Button("Logout", role: .destructive) {
                    appState.logout()
                }
            } message: {
                Text("Are you sure you want to logout? Your messages will remain encrypted on this device.")
            }
        }
    }
    
    func getAppVersion() -> String {
        let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0"
        let build = Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "1"
        return "\(version) (\(build))"
    }
}

// MARK: - Security Keys View
struct SecurityKeysView: View {
    @EnvironmentObject var cryptoService: CryptoService
    @State private var showingFingerprint = false
    
    var body: some View {
        ZStack {
            Color("VaultDark").ignoresSafeArea()
            
            List {
                Section("Identity Key") {
                    if let publicKey = cryptoService.getPublicKey() {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Your public identity key")
                                .font(.caption)
                                .foregroundColor(.white.opacity(0.6))
                            
                            Text(CryptoUtils.formatFingerprint(publicKey.base64EncodedString()))
                                .font(.system(.body, design: .monospaced))
                                .foregroundColor(.white)
                                .padding()
                                .background(Color.white.opacity(0.05))
                                .cornerRadius(8)
                            
                            Button(action: { showingFingerprint = true }) {
                                Label("Show QR Code", systemImage: "qrcode")
                                    .foregroundColor(Color("VaultPurple"))
                            }
                        }
                        .padding(.vertical, 8)
                    }
                }
                .listRowBackground(Color.white.opacity(0.05))
                
                Section("Post-Quantum Keys") {
                    Text("ML-KEM-768 keys for quantum-resistant encryption")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.6))
                    
                    Button(action: {}) {
                        Label("Regenerate PQ Keys", systemImage: "arrow.clockwise")
                            .foregroundColor(Color("VaultPurple"))
                    }
                }
                .listRowBackground(Color.white.opacity(0.05))
            }
            .scrollContentBackground(.hidden)
        }
        .navigationTitle("Identity Keys")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Backup View
struct BackupView: View {
    var body: some View {
        ZStack {
            Color("VaultDark").ignoresSafeArea()
            
            VStack(spacing: 20) {
                Image(systemName: "icloud.and.arrow.up")
                    .font(.system(size: 60))
                    .foregroundColor(Color("VaultPurple"))
                
                Text("Encrypted Backups")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                
                Text("Back up your encrypted messages to iCloud. Only you can decrypt them.")
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.7))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
                
                Button(action: {}) {
                    Text("Create Backup")
                        .fontWeight(.bold)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color("VaultPurple"))
                        .foregroundColor(.white)
                        .cornerRadius(12)
                }
                .padding(.horizontal)
            }
        }
        .navigationTitle("Backup")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Blocked Users View
struct BlockedUsersView: View {
    var body: some View {
        ZStack {
            Color("VaultDark").ignoresSafeArea()
            
            List {
                // TODO: Show blocked users
            }
            .scrollContentBackground(.hidden)
        }
        .navigationTitle("Blocked Users")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Notification Settings View
struct NotificationSettingsView: View {
    @State private var notificationsEnabled = true
    @State private var showPreviews = true
    @State private var soundEnabled = true
    
    var body: some View {
        ZStack {
            Color("VaultDark").ignoresSafeArea()
            
            List {
                Section {
                    Toggle(isOn: $notificationsEnabled) {
                        Text("Enable Notifications")
                            .foregroundColor(.white)
                    }
                    .tint(Color("VaultPurple"))
                    
                    Toggle(isOn: $showPreviews) {
                        Text("Show Message Previews")
                            .foregroundColor(.white)
                    }
                    .tint(Color("VaultPurple"))
                    .disabled(!notificationsEnabled)
                    
                    Toggle(isOn: $soundEnabled) {
                        Text("Sound")
                            .foregroundColor(.white)
                    }
                    .tint(Color("VaultPurple"))
                    .disabled(!notificationsEnabled)
                }
                .listRowBackground(Color.white.opacity(0.05))
            }
            .scrollContentBackground(.hidden)
        }
        .navigationTitle("Notifications")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - About View
struct AboutView: View {
    var body: some View {
        ZStack {
            Color("VaultDark").ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 30) {
                    Image(systemName: "lock.shield.fill")
                        .font(.system(size: 80))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [.white, .cyan],
                                startPoint: .top,
                                endPoint: .bottom
                            )
                        )
                        .padding(.top, 40)
                    
                    Text("VAULT")
                        .font(.system(size: 42, weight: .black, design: .rounded))
                        .foregroundColor(.white)
                    
                    Text("The Secure Messaging Platform That Swallows All Traces")
                        .font(.subheadline)
                        .foregroundColor(.white.opacity(0.7))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                    
                    VStack(alignment: .leading, spacing: 15) {
                        FeatureRow(icon: "lock.shield.fill", title: "Military-Grade Encryption", subtitle: "Signal Protocol + MLS")
                        FeatureRow(icon: "shield.checkered", title: "Post-Quantum Security", subtitle: "ML-KEM-768 lattice cryptography")
                        FeatureRow(icon: "eye.slash.fill", title: "Zero-Knowledge Proofs", subtitle: "Prove identity without revealing secrets")
                        FeatureRow(icon: "server.rack", title: "Zero Server Storage", subtitle: "Messages never stored on servers")
                        FeatureRow(icon: "timer", title: "Ephemeral by Design", subtitle: "Auto-delete after set period")
                    }
                    .padding()
                    .background(Color.white.opacity(0.05))
                    .cornerRadius(16)
                    .padding(.horizontal)
                    
                    Text("© 2026 VAULT. All rights reserved.")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.5))
                        .padding(.bottom, 40)
                }
            }
        }
        .navigationTitle("About")
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct FeatureRow: View {
    let icon: String
    let title: String
    let subtitle: String
    
    var body: some View {
        HStack(spacing: 15) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(Color("VaultPurple"))
                .frame(width: 30)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                
                Text(subtitle)
                    .font(.caption)
                    .foregroundColor(.white.opacity(0.6))
            }
        }
    }
}

// MARK: - Privacy Policy View
struct PrivacyPolicyView: View {
    var body: some View {
        ZStack {
            Color("VaultDark").ignoresSafeArea()
            
            ScrollView {
                Text("Privacy Policy content goes here...")
                    .foregroundColor(.white)
                    .padding()
            }
        }
        .navigationTitle("Privacy Policy")
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    SettingsView()
        .environmentObject(AppState())
        .environmentObject(CryptoService.shared)
}
