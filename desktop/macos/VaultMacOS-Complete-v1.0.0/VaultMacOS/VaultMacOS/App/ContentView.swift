//
//  ContentView.swift
//  VAULT
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var authViewModel: AuthenticationViewModel
    
    var body: some View {
        Group {
            if authViewModel.isAuthenticated {
                if appState.isLocked {
                    LockScreenView()
                } else {
                    MainView()
                }
            } else {
                AuthenticationView()
            }
        }
        .frame(minWidth: 900, minHeight: 600)
    }
}

struct MainView: View {
    @State private var selection: SidebarItem? = .chats
    
    var body: some View {
        NavigationSplitView {
            SidebarView(selection: $selection)
        } detail: {
            switch selection {
            case .chats:
                ChatListView()
            case .contacts:
                ContactsView()
            case .settings:
                SettingsView()
            case .none:
                Text("Select an item")
                    .foregroundColor(.secondary)
            }
        }
    }
}

enum SidebarItem: String, CaseIterable {
    case chats = "Chats"
    case contacts = "Contacts"
    case settings = "Settings"
    
    var icon: String {
        switch self {
        case .chats: return "message.fill"
        case .contacts: return "person.2.fill"
        case .settings: return "gearshape.fill"
        }
    }
}

struct SidebarView: View {
    @Binding var selection: SidebarItem?
    
    var body: some View {
        List(SidebarItem.allCases, id: \.self, selection: $selection) { item in
            Label(item.rawValue, systemImage: item.icon)
        }
        .navigationTitle("VAULT")
        .listStyle(.sidebar)
    }
}
