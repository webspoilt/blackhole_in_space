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
