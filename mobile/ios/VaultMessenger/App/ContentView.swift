//
//  ContentView.swift
//  VaultMessenger
//
//  Main app navigation and routing
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var appState: AppState
    @State private var showingSplash = true
    
    var body: some View {
        ZStack {
            if showingSplash {
                SplashView()
                    .transition(.opacity)
            } else {
                if appState.isAuthenticated {
                    MainTabView()
                        .transition(.move(edge: .trailing))
                } else {
                    AuthenticationView()
                        .transition(.move(edge: .leading))
                }
            }
        }
        .onAppear {
            // Show splash for 2 seconds
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                withAnimation(.easeInOut(duration: 0.5)) {
                    showingSplash = false
                }
            }
        }
        .preferredColorScheme(.dark)
    }
}

// MARK: - Splash View
struct SplashView: View {
    @State private var animateGradient = false
    
    var body: some View {
        ZStack {
            // Animated background
            LinearGradient(
                colors: [
                    Color("VaultDark"),
                    Color("VaultPurple"),
                    Color("VaultDark")
                ],
                startPoint: animateGradient ? .topLeading : .bottomTrailing,
                endPoint: animateGradient ? .bottomTrailing : .topLeading
            )
            .ignoresSafeArea()
            .onAppear {
                withAnimation(.linear(duration: 3).repeatForever(autoreverses: true)) {
                    animateGradient = true
                }
            }
            
            VStack(spacing: 20) {
                // VAULT logo
                Image(systemName: "lock.shield.fill")
                    .font(.system(size: 100))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [.white, .cyan],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                
                Text("VAULT")
                    .font(.system(size: 48, weight: .black, design: .rounded))
                    .foregroundColor(.white)
                
                Text("The Secure Messaging Platform")
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.8))
                
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    .scaleEffect(1.5)
                    .padding(.top, 40)
            }
        }
    }
}

// MARK: - Main Tab View
struct MainTabView: View {
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            MessagesListView()
                .tabItem {
                    Label("Messages", systemImage: "message.fill")
                }
                .tag(0)
            
            ContactsView()
                .tabItem {
                    Label("Contacts", systemImage: "person.2.fill")
                }
                .tag(1)
            
            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gear")
                }
                .tag(2)
        }
        .accentColor(Color("VaultPurple"))
    }
}

#Preview {
    ContentView()
        .environmentObject(AppState())
        .environmentObject(CryptoService.shared)
        .environmentObject(NetworkService.shared)
}
