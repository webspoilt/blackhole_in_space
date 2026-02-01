//
//  AppDelegate.swift
//  VAULT
//

import Cocoa
import UserNotifications

class AppDelegate: NSObject, NSApplicationDelegate {
    func applicationDidFinishLaunching(_ notification: Notification) {
        setupNotifications()
        registerURLScheme()
    }
    
    func applicationWillTerminate(_ notification: Notification) {
        WebSocketManager.shared.disconnect()
        DatabaseManager.shared.close()
        CryptoManager.shared.clearSensitiveData()
    }
    
    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return false
    }
    
    private func setupNotifications() {
        let center = UNUserNotificationCenter.current()
        center.requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
            if granted {
                DispatchQueue.main.async {
                    NSApplication.shared.registerForRemoteNotifications()
                }
            }
        }
    }
    
    private func registerURLScheme() {
        NSAppleEventManager.shared().setEventHandler(
            self,
            andSelector: #selector(handleURLEvent(_:withReplyEvent:)),
            forEventClass: AEEventClass(kInternetEventClass),
            andEventID: AEEventID(kAEGetURL)
        )
    }
    
    @objc func handleURLEvent(_ event: NSAppleEventDescriptor, withReplyEvent: NSAppleEventDescriptor) {
        guard let urlString = event.paramDescriptor(forKeyword: keyDirectObject)?.stringValue,
              let url = URL(string: urlString) else { return }
        // Handle vault:// URLs
        NotificationCenter.default.post(name: .handleDeepLink, object: url)
    }
}

extension Notification.Name {
    static let handleDeepLink = Notification.Name("handleDeepLink")
}
