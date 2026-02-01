//
//  AuthenticationView.swift
//  VaultMessenger
//
//  User authentication and registration
//

import SwiftUI

struct AuthenticationView: View {
    @State private var isSignUp = false
    @State private var username = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var displayName = ""
    @State private var isLoading = false
    @State private var errorMessage: String?
    @State private var showBiometric = false
    
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var cryptoService: CryptoService
    
    var body: some View {
        ZStack {
            // Background gradient
            LinearGradient(
                colors: [Color("VaultDark"), Color("VaultPurple").opacity(0.3)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 30) {
                    Spacer()
                    
                    // Logo
                    VStack(spacing: 15) {
                        Image(systemName: "lock.shield.fill")
                            .font(.system(size: 80))
                            .foregroundStyle(
                                LinearGradient(
                                    colors: [.white, .cyan],
                                    startPoint: .top,
                                    endPoint: .bottom
                                )
                            )
                        
                        Text("VAULT")
                            .font(.system(size: 42, weight: .black, design: .rounded))
                            .foregroundColor(.white)
                        
                        Text(isSignUp ? "Create Account" : "Welcome Back")
                            .font(.title3)
                            .foregroundColor(.white.opacity(0.8))
                    }
                    .padding(.top, 60)
                    
                    // Auth Form
                    VStack(spacing: 20) {
                        if isSignUp {
                            CustomTextField(
                                icon: "person.fill",
                                placeholder: "Display Name",
                                text: $displayName
                            )
                        }
                        
                        CustomTextField(
                            icon: "at",
                            placeholder: "Username",
                            text: $username
                        )
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                        
                        CustomTextField(
                            icon: "lock.fill",
                            placeholder: "Password",
                            text: $password,
                            isSecure: true
                        )
                        
                        if isSignUp {
                            CustomTextField(
                                icon: "lock.fill",
                                placeholder: "Confirm Password",
                                text: $confirmPassword,
                                isSecure: true
                            )
                        }
                        
                        if let error = errorMessage {
                            Text(error)
                                .font(.caption)
                                .foregroundColor(.red)
                                .padding(.horizontal)
                        }
                        
                        // Auth Button
                        Button(action: handleAuth) {
                            HStack {
                                if isLoading {
                                    ProgressView()
                                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                } else {
                                    Text(isSignUp ? "Sign Up" : "Sign In")
                                        .fontWeight(.bold)
                                }
                            }
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
                            .cornerRadius(15)
                        }
                        .disabled(isLoading || !isFormValid)
                        .opacity(isFormValid ? 1.0 : 0.6)
                        
                        // Biometric Auth
                        if !isSignUp && BiometricAuth.biometricType != .none {
                            Button(action: handleBiometricAuth) {
                                HStack {
                                    Image(systemName: BiometricAuth.biometricType == .faceID ? "faceid" : "touchid")
                                    Text("Sign in with \(BiometricAuth.biometricType == .faceID ? "Face ID" : "Touch ID")")
                                }
                                .foregroundColor(.white.opacity(0.8))
                            }
                        }
                        
                        // Toggle Sign Up / Sign In
                        Button(action: { isSignUp.toggle() }) {
                            HStack {
                                Text(isSignUp ? "Already have an account?" : "Don't have an account?")
                                    .foregroundColor(.white.opacity(0.7))
                                Text(isSignUp ? "Sign In" : "Sign Up")
                                    .fontWeight(.bold)
                                    .foregroundColor(.cyan)
                            }
                        }
                        .padding(.top)
                    }
                    .padding(.horizontal, 30)
                    
                    Spacer()
                    
                    // Security Info
                    VStack(spacing: 10) {
                        HStack(spacing: 15) {
                            SecurityBadge(icon: "lock.shield.fill", text: "E2E Encrypted")
                            SecurityBadge(icon: "eye.slash.fill", text: "Zero Knowledge")
                            SecurityBadge(icon: "shield.checkered", text: "Post-Quantum")
                        }
                    }
                    .padding(.bottom, 30)
                }
            }
        }
    }
    
    var isFormValid: Bool {
        if isSignUp {
            return !username.isEmpty && !password.isEmpty &&
                   !displayName.isEmpty && password == confirmPassword &&
                   password.count >= 8
        } else {
            return !username.isEmpty && !password.isEmpty
        }
    }
    
    func handleAuth() {
        errorMessage = nil
        isLoading = true
        
        Task {
            do {
                if isSignUp {
                    try await signUp()
                } else {
                    try await signIn()
                }
            } catch {
                await MainActor.run {
                    errorMessage = error.localizedDescription
                    isLoading = false
                }
            }
        }
    }
    
    func signUp() async throws {
        // Generate cryptographic identity
        guard let publicKey = cryptoService.getPublicKey(),
              let identityKey = cryptoService.getIdentityKey() else {
            throw AuthError.keyGenerationFailed
        }
        
        // Create user
        let user = User(
            id: UUID().uuidString,
            username: username,
            displayName: displayName,
            publicKey: publicKey.base64EncodedString(),
            identityKey: identityKey
        )
        
        // Register with server
        try await AuthService.register(
            user: user,
            password: password
        )
        
        // Save user data
        if let userData = user.toData() {
            SecureStorage.saveUserId(user.id)
            SecureStorage.saveUserData(userData)
        }
        
        await MainActor.run {
            appState.isAuthenticated = true
            appState.currentUser = user
            isLoading = false
        }
    }
    
    func signIn() async throws {
        // Authenticate with server
        let authResult = try await AuthService.login(
            username: username,
            password: password
        )
        
        // Save auth token
        SecureStorage.saveAuthToken(authResult.token)
        SecureStorage.saveUserId(authResult.userId)
        
        if let userData = authResult.userData {
            SecureStorage.saveUserData(userData)
        }
        
        await MainActor.run {
            appState.checkAuthentication()
            isLoading = false
        }
    }
    
    func handleBiometricAuth() {
        BiometricAuth.authenticate(reason: "Sign in to VAULT") { success, error in
            if success {
                // Use stored credentials
                Task {
                    do {
                        try await signIn()
                    } catch {
                        errorMessage = error.localizedDescription
                    }
                }
            } else {
                errorMessage = "Biometric authentication failed"
            }
        }
    }
}

// MARK: - Custom TextField
struct CustomTextField: View {
    let icon: String
    let placeholder: String
    @Binding var text: String
    var isSecure: Bool = false
    
    var body: some View {
        HStack(spacing: 15) {
            Image(systemName: icon)
                .foregroundColor(.white.opacity(0.7))
                .frame(width: 20)
            
            if isSecure {
                SecureField(placeholder, text: $text)
                    .foregroundColor(.white)
            } else {
                TextField(placeholder, text: $text)
                    .foregroundColor(.white)
            }
        }
        .padding()
        .background(Color.white.opacity(0.1))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.white.opacity(0.2), lineWidth: 1)
        )
    }
}

// MARK: - Security Badge
struct SecurityBadge: View {
    let icon: String
    let text: String
    
    var body: some View {
        VStack(spacing: 5) {
            Image(systemName: icon)
                .font(.system(size: 20))
            Text(text)
                .font(.caption2)
        }
        .foregroundColor(.white.opacity(0.6))
        .frame(width: 100)
    }
}

// MARK: - Auth Service
class AuthService {
    static func register(user: User, password: String) async throws {
        // API call to register user
        // Implementation depends on your backend
        
        var request = URLRequest(url: URL(string: "https://b2g-vault.vercel.app/api/auth/register")!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body: [String: Any] = [
            "username": user.username,
            "displayName": user.displayName,
            "publicKey": user.publicKey,
            "identityKey": user.identityKey,
            "password": password
        ]
        
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (_, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw AuthError.registrationFailed
        }
    }
    
    static func login(username: String, password: String) async throws -> AuthResult {
        var request = URLRequest(url: URL(string: "https://b2g-vault.vercel.app/api/auth/login")!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body: [String: String] = [
            "username": username,
            "password": password
        ]
        
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw AuthError.loginFailed
        }
        
        let result = try JSONDecoder().decode(AuthResult.self, from: data)
        return result
    }
}

struct AuthResult: Codable {
    let token: String
    let userId: String
    let userData: Data?
}

enum AuthError: Error {
    case keyGenerationFailed
    case registrationFailed
    case loginFailed
    case invalidCredentials
}

#Preview {
    AuthenticationView()
        .environmentObject(AppState())
        .environmentObject(CryptoService.shared)
}
