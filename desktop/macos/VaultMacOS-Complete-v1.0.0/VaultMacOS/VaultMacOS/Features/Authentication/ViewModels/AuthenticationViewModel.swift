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
