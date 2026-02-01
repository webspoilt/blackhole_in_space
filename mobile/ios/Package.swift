// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "VaultMessenger",
    platforms: [
        .iOS(.v17)
    ],
    products: [
        .library(
            name: "VaultMessenger",
            targets: ["VaultMessenger"]
        )
    ],
    dependencies: [
        // WebSocket and networking
        .package(url: "https://github.com/daltoniam/Starscream.git", from: "4.0.0"),
        
        // Keychain wrapper
        .package(url: "https://github.com/evgenyneu/keychain-swift.git", from: "20.0.0"),
        
        // QR Code generation
        .package(url: "https://github.com/dagronf/QRCode.git", from: "17.0.0"),
        
        // Image picker
        .package(url: "https://github.com/exyte/PhotoPickerPanel.git", from: "1.0.0"),
    ],
    targets: [
        .target(
            name: "VaultMessenger",
            dependencies: [
                "Starscream",
                .product(name: "KeychainSwift", package: "keychain-swift"),
                "QRCode",
                "PhotoPickerPanel",
                "VaultCrypto"
            ],
            path: "VaultMessenger"
        ),
        
        // Rust crypto library
        .binaryTarget(
            name: "VaultCrypto",
            path: "Frameworks/VaultCrypto.xcframework"
        ),
        
        .testTarget(
            name: "VaultMessengerTests",
            dependencies: ["VaultMessenger"],
            path: "VaultMessengerTests"
        )
    ]
)
