// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "VaultMacOS",
    platforms: [.macOS(.v13)],
    products: [
        .library(name: "VaultMacOS", targets: ["VaultMacOS"])
    ],
    dependencies: [
        .package(url: "https://github.com/groue/GRDB.swift.git", from: "6.24.0"),
        .package(url: "https://github.com/jedisct1/swift-sodium.git", from: "0.9.1"),
        .package(url: "https://github.com/daltoniam/Starscream.git", from: "4.0.6"),
        .package(url: "https://github.com/kishikawakatsumi/KeychainAccess.git", from: "4.2.2")
    ],
    targets: [
        .target(
            name: "VaultMacOS",
            dependencies: [
                .product(name: "GRDB", package: "GRDB.swift"),
                .product(name: "Sodium", package: "swift-sodium"),
                .product(name: "Starscream", package: "Starscream"),
                .product(name: "KeychainAccess", package: "KeychainAccess")
            ]
        )
    ]
)
