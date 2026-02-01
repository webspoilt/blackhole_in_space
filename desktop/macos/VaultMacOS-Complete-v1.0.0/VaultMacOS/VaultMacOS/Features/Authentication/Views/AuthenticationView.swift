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
