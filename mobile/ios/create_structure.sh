#!/bin/bash

# Create Xcode project structure
mkdir -p VaultMessenger.xcodeproj
mkdir -p VaultMessenger/{App,Core,Features,Services,Utilities,Resources,Bridge}
mkdir -p VaultMessenger/Features/{Authentication,Messaging,Contacts,Settings}
mkdir -p VaultMessenger/Services/{Networking,Crypto,Storage,Notifications}
mkdir -p VaultMessenger/Core/{Models,ViewModels,Extensions}
mkdir -p VaultMessenger/Resources/{Assets.xcassets,Fonts}
mkdir -p VaultMessenger/Bridge/{Rust,Headers}
mkdir -p VaultMessengerTests
mkdir -p VaultMessengerUITests
mkdir -p Scripts
mkdir -p Frameworks

echo "✓ Project structure created"
