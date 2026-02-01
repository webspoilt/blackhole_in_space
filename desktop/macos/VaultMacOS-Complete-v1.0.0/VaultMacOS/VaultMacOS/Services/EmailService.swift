//
//  EmailService.swift
//  VAULT - Email via Resend API
//

import Foundation

class EmailService {
    static let shared = EmailService()
    private let apiKey = ConfigManager.shared.resendAPIKey
    private let from = ConfigManager.shared.senderEmail
    
    func sendVerificationEmail(to email: String, code: String) async throws {
        let endpoint = "https://api.resend.com/emails"
        
        let body: [String: Any] = [
            "from": from,
            "to": [email],
            "subject": "VAULT - Verify Your Email",
            "html": """
            <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>Welcome to VAULT</h2>
                <p>Your verification code is:</p>
                <h1 style="color: #007AFF; letter-spacing: 4px;">\(code)</h1>
                <p>This code expires in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </body>
            </html>
            """
        ]
        
        var request = URLRequest(url: URL(string: endpoint)!)
        request.httpMethod = "POST"
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (_, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw NSError(domain: "EmailService", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to send email"])
        }
    }
}
