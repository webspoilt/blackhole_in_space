//
//  VaultMacOSApp.swift
//  VAULT - Military-Grade Secure Messaging
//

import SwiftUI
import LocalAuthentication

@main
struct VaultMacOSApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @StateObject private var appState = AppState()
    @StateObject private var authViewModel = AuthenticationViewModel()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .environmentObject(authViewModel)
                .onAppear(perform: setupApplication)
        }
        .commands {
            CommandGroup(replacing: .newItem) {
                Button("New Message") { appState.showNewMessage = true }
                    .keyboardShortcut("n", modifiers: .command)
            }
            
            CommandMenu("Security") {
                Button("Lock App") { appState.lockApp() }
                    .keyboardShortcut("l", modifiers: [.command, .shift])
                Divider()
                Button("Verify Device") { appState.showDeviceVerification = true }
            }
        }
        
        Settings {
            SettingsView().environmentObject(appState)
        }
    }
    
    private func setupApplication() {
        CryptoManager.shared.initialize()
        DatabaseManager.shared.setup()
        if authViewModel.isAuthenticated {
            WebSocketManager.shared.connect()
        }
    }
}

class AppState: ObservableObject {
    @Published var isLocked = false
    @Published var showNewMessage = false
    @Published var showDeviceVerification = false
    @Published var biometricEnabled = UserDefaults.standard.bool(forKey: "biometricEnabled")
    
    func lockApp() {
        isLocked = true
        CryptoManager.shared.clearSensitiveData()
    }
}
