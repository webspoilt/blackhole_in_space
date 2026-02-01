//
//  VaultMessengerApp.swift
//  VaultMessenger
//
//  VAULT - The Secure Messaging Platform
//  Copyright © 2026 VAULT. All rights reserved.
//

import SwiftUI

@main
struct VaultMessengerApp: App {
    @StateObject private var appState = AppState()
    @StateObject private var cryptoService = CryptoService.shared
    @StateObject private var networkService = NetworkService.shared
    
    init() {
        setupAppearance()
        setupSecurity()
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .environmentObject(cryptoService)
                .environmentObject(networkService)
                .onAppear {
                    initializeServices()
                }
        }
    }
    
    private func setupAppearance() {
        // Configure app-wide appearance
        let appearance = UINavigationBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor(named: "VaultDark")
        appearance.titleTextAttributes = [.foregroundColor: UIColor.white]
        appearance.largeTitleTextAttributes = [.foregroundColor: UIColor.white]
        
        UINavigationBar.appearance().standardAppearance = appearance
        UINavigationBar.appearance().scrollEdgeAppearance = appearance
        UINavigationBar.appearance().compactAppearance = appearance
    }
    
    private func setupSecurity() {
        // Enable memory protection
        MemoryProtection.enableSecureMemory()
        
        // Configure certificate pinning
        NetworkSecurity.configureCertificatePinning()
        
        // Setup secure storage
        SecureStorage.initialize()
    }
    
    private func initializeServices() {
        Task {
            await cryptoService.initialize()
            await networkService.connect()
        }
    }
}

// MARK: - App State
class AppState: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var showingLockScreen = false
    
    init() {
        checkAuthentication()
    }
    
    func checkAuthentication() {
        // Check if user has valid session
        if let userId = SecureStorage.getUserId(),
           let _ = SecureStorage.getIdentityKey() {
            isAuthenticated = true
            loadCurrentUser()
        }
    }
    
    private func loadCurrentUser() {
        // Load user from secure storage
        if let userData = SecureStorage.getUserData() {
            currentUser = User.from(data: userData)
        }
    }
    
    func logout() {
        SecureStorage.clearAll()
        isAuthenticated = false
        currentUser = nil
    }
}
