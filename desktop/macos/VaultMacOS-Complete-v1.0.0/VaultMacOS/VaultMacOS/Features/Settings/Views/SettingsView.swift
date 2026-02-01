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
