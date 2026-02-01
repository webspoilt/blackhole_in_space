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
