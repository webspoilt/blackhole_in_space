//
//  ContactsView.swift
//  VAULT
//

import SwiftUI

struct ContactsView: View {
    @State private var contacts: [Contact] = []
    
    var body: some View {
        List(contacts) { contact in
            HStack {
                Circle()
                    .fill(.green)
                    .frame(width: 40, height: 40)
                    .overlay {
                        Text(contact.name.prefix(1))
                            .foregroundColor(.white)
                    }
                
                VStack(alignment: .leading) {
                    Text(contact.name)
                        .font(.headline)
                    Text(contact.email)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                if contact.verified {
                    Image(systemName: "checkmark.shield.fill")
                        .foregroundColor(.green)
                }
            }
        }
        .navigationTitle("Contacts")
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button(action: {}) {
                    Image(systemName: "plus")
                }
            }
        }
    }
}

struct Contact: Identifiable {
    let id = UUID()
    let name: String
    let email: String
    let verified: Bool
}
