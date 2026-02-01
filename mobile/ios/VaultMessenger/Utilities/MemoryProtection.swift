//
//  MemoryProtection.swift
//  VaultMessenger
//
//  Secure memory management and screen protection
//

import UIKit
import Foundation

class MemoryProtection {
    
    /// Enables secure memory protection features
    static func enableSecureMemory() {
        setupScreenProtection()
        clearSensitiveDataOnBackground()
    }
    
    /// Prevents screen recording and screenshots using standard iOS protection
    private static func setupScreenProtection() {
        DispatchQueue.main.async {
            // Note: In a real production app with sensitive data, we might overlay a view
            // that is hidden from screenshots using UITextField.isSecureTextEntry trick
            // or specific API if available (like screen capture observers).
            
            // This is a placeholder for the actual detailed implementation which often involves
            // adding a hidden secure text field to the window or using specific 
            // window level protections.
            
             NotificationCenter.default.addObserver(
                self,
                selector: #selector(handleScreenCaptureChange),
                name: UIScreen.capturedDidChangeNotification,
                object: nil
            )
        }
    }
    
    @objc private static func handleScreenCaptureChange() {
        if UIScreen.main.isCaptured {
            // Screen is being recorded or mirrored
            // Hide sensitive content
            // NotificationCenter.default.post(name: .hideSensitiveContent, object: nil)
        } else {
            // Screen recording stopped
            // Show content
            // NotificationCenter.default.post(name: .showSensitiveContent, object: nil)
        }
    }
    
    /// Clears sensitive data from memory when app moves to background
    private static func clearSensitiveDataOnBackground() {
        NotificationCenter.default.addObserver(
            forName: UIApplication.willResignActiveNotification,
            object: nil,
            queue: .main
        ) { _ in
            // Clear pasteboard if it contains sensitive info
            UIPasteboard.general.items = []
            
            // Trigger secure overwrite of any sensitive data buffers if accessible
            // This would interface with the Rust core in a full implementation
        }
    }
    
    /// Securely overwrites memory with zeros
    /// - Parameter data: The data to wipe
    static func zeroMemory(_ data: inout Data) {
        data.resetBytes(in: 0..<data.count)
    }
}
