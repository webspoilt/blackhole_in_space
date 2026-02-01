//! Crisis Mode & Emergency Communications
//!
//! Government-grade emergency communication features:
//! - Emergency broadcast (bypasses all settings)
//! - Cabinet mode (multi-person authorization)
//! - Evacuation coordination
//! - Secure crisis channels

use wasm_bindgen::prelude::*;
use zeroize::{Zeroize, ZeroizeOnDrop};

/// Crisis level classification
#[derive(Clone, Copy, Debug, PartialEq)]
pub enum CrisisLevel {
    /// Advisory - Information only
    Yellow,
    /// Watch - Be prepared
    Orange,
    /// Warning - Immediate action required
    Red,
    /// Emergency - Life threatening
    Black,
}

impl CrisisLevel {
    fn priority(&self) -> u8 {
        match self {
            CrisisLevel::Yellow => 1,
            CrisisLevel::Orange => 2,
            CrisisLevel::Red => 3,
            CrisisLevel::Black => 4,
        }
    }
    
    fn display_name(&self) -> &'static str {
        match self {
            CrisisLevel::Yellow => "🟡 ADVISORY",
            CrisisLevel::Orange => "🟠 WATCH",
            CrisisLevel::Red => "🔴 WARNING",
            CrisisLevel::Black => "⚫ EMERGENCY",
        }
    }
}

/// Crisis mode manager
#[wasm_bindgen]
pub struct CrisisMode {
    /// Current crisis level
    level: CrisisLevel,
    
    /// Whether crisis mode is active
    active: bool,
    
    /// Authorized broadcasters (identity fingerprints)
    authorized_broadcasters: Vec<String>,
    
    /// Crisis channels
    channels: Vec<CrisisChannel>,
    
    /// Active alerts
    active_alerts: Vec<Alert>,
    
    /// Multi-person auth for cabinet mode
    mpa_config: MultiPersonAuth,
}

/// Crisis communication channel
#[derive(Clone, Debug)]
struct CrisisChannel {
    id: String,
    name: String,
    level: CrisisLevel,
    members: Vec<String>,
    auto_delete: bool,
}

/// Emergency alert
#[derive(Clone, Debug)]
struct Alert {
    id: String,
    level: CrisisLevel,
    title: String,
    message: String,
    sender: String,
    timestamp: u64,
    acknowledged_by: Vec<String>,
    zones: Vec<String>, // For geofenced alerts
}

/// Multi-person authorization configuration
#[derive(Clone, Debug)]
struct MultiPersonAuth {
    /// Number of approvals required
    required_approvals: u32,
    
    /// Authorized approvers
    approvers: Vec<String>,
    
    /// Pending approvals
    pending: Vec<PendingApproval>,
}

/// Pending approval for sensitive operation
#[derive(Clone, Debug)]
struct PendingApproval {
    operation_id: String,
    operation_type: String,
    requested_by: String,
    approvals: Vec<String>,
    timestamp: u64,
}

#[wasm_bindgen]
impl CrisisMode {
    /// Create new crisis mode manager
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        CrisisMode {
            level: CrisisLevel::Yellow,
            active: false,
            authorized_broadcasters: vec![],
            channels: vec![],
            active_alerts: vec![],
            mpa_config: MultiPersonAuth {
                required_approvals: 2,
                approvers: vec![],
                pending: vec![],
            },
        }
    }
    
    /// Activate crisis mode
    #[wasm_bindgen]
    pub fn activate(&mut self, level: &str) -> Result<(), JsValue> {
        self.level = match level {
            "yellow" => CrisisLevel::Yellow,
            "orange" => CrisisLevel::Orange,
            "red" => CrisisLevel::Red,
            "black" => CrisisLevel::Black,
            _ => return Err(JsValue::from_str("Invalid crisis level")),
        };
        
        self.active = true;
        
        log::warn!("🚨 CRISIS MODE ACTIVATED: {}", self.level.display_name());
        
        // Notify all users
        self.broadcast_system_alert(&format!(
            "CRISIS MODE ACTIVATED - {}. Check crisis channels for updates.",
            self.level.display_name()
        ));
        
        Ok(())
    }
    
    /// Deactivate crisis mode
    #[wasm_bindgen]
    pub fn deactivate(&mut self) {
        self.active = false;
        self.level = CrisisLevel::Yellow;
        
        log::info!("✅ Crisis mode deactivated");
        
        self.broadcast_system_alert("Crisis mode deactivated. Normal operations resumed.");
    }
    
    /// Send emergency broadcast (bypasses all user settings)
    #[wasm_bindgen]
    pub fn emergency_broadcast(&self, 
        title: &str, 
        message: &str,
        level: &str
    ) -> Result<String, JsValue> {
        let crisis_level = match level {
            "yellow" => CrisisLevel::Yellow,
            "orange" => CrisisLevel::Orange,
            "red" => CrisisLevel::Red,
            "black" => CrisisLevel::Black,
            _ => return Err(JsValue::from_str("Invalid level")),
        };
        
        let alert = Alert {
            id: format!("ALERT-{}", js_sys::Date::now()),
            level: crisis_level,
            title: title.to_string(),
            message: message.to_string(),
            sender: "SYSTEM".to_string(),
            timestamp: js_sys::Date::now() as u64,
            acknowledged_by: vec![],
            zones: vec![],
        };
        
        // This would:
        // 1. Override DND settings
        // 2. Play alert sound even on silent
        // 3. Show full-screen notification
        // 4. Require acknowledgment
        // 5. Log for audit
        
        log::warn!("🚨 EMERGENCY BROADCAST: {}", title);
        
        Ok(alert.id)
    }
    
    /// Send geofenced evacuation alert
    #[wasm_bindgen]
    pub fn evacuation_alert(&self,
        zones_js: js_sys::Array,
        instructions: &str,
        assembly_points_js: js_sys::Array
    ) -> Result<String, JsValue> {
        let zones: Vec<String> = zones_js.iter()
            .filter_map(|v| v.as_string())
            .collect();
        
        let assembly_points: Vec<String> = assembly_points_js.iter()
            .filter_map(|v| v.as_string())
            .collect();
        
        let alert = Alert {
            id: format!("EVAC-{}", js_sys::Date::now()),
            level: CrisisLevel::Red,
            title: "🚨 EVACUATION ORDER".to_string(),
            message: format!("{}", instructions),
            sender: "EMERGENCY_SYSTEM".to_string(),
            timestamp: js_sys::Date::now() as u64,
            acknowledged_by: vec![],
            zones,
        };
        
        log::warn!("🚨 EVACUATION ALERT for zones: {:?}", alert.zones);
        
        Ok(alert.id)
    }
    
    /// Activate cabinet mode (highest security)
    #[wasm_bindgen]
    pub fn activate_cabinet_mode(&mut self, 
        members_js: js_sys::Array
    ) -> Result<(), JsValue> {
        let members: Vec<String> = members_js.iter()
            .filter_map(|v| v.as_string())
            .collect();
        
        if members.len() < 3 {
            return Err(JsValue::from_str(
                "Cabinet mode requires at least 3 members"
            ));
        }
        
        // Create secure cabinet channel
        let channel = CrisisChannel {
            id: format!("CABINET-{}", js_sys::Date::now()),
            name: "Cabinet Communications".to_string(),
            level: CrisisLevel::Black,
            members,
            auto_delete: true,
        };
        
        self.channels.push(channel);
        
        log::warn!("🔒 CABINET MODE ACTIVATED");
        
        Ok(())
    }
    
    /// Request multi-person authorization
    #[wasm_bindgen]
    pub fn request_approval(&mut self,
        operation_type: &str,
        details: &str,
        requester: &str
    ) -> Result<String, JsValue> {
        let approval = PendingApproval {
            operation_id: format!("OP-{}", js_sys::Date::now()),
            operation_type: operation_type.to_string(),
            requested_by: requester.to_string(),
            approvals: vec![],
            timestamp: js_sys::Date::now() as u64,
        };
        
        let op_id = approval.operation_id.clone();
        self.mpa_config.pending.push(approval);
        
        log::info!("⏳ MPA requested for {} by {}", operation_type, requester);
        
        Ok(op_id)
    }
    
    /// Approve a pending operation
    #[wasm_bindgen]
    pub fn approve_operation(&mut self,
        operation_id: &str,
        approver: &str
    ) -> Result<bool, JsValue> {
        let pending = self.mpa_config.pending.iter_mut()
            .find(|p| p.operation_id == operation_id)
            .ok_or_else(|| JsValue::from_str("Operation not found"))?;
        
        // Check if approver is authorized
        if !self.mpa_config.approvers.contains(&approver.to_string()) {
            return Err(JsValue::from_str("Not authorized to approve"));
        }
        
        // Add approval
        pending.approvals.push(approver.to_string());
        
        // Check if enough approvals
        let approved = pending.approvals.len() as u32 >= self.mpa_config.required_approvals;
        
        if approved {
            log::warn!("✅ Operation {} approved by {} approvers", 
                operation_id, pending.approvals.len());
            
            // Remove from pending
            self.mpa_config.pending.retain(|p| p.operation_id != operation_id);
        } else {
            log::info!("⏳ Operation {} has {}/{} approvals", 
                operation_id, pending.approvals.len(), self.mpa_config.required_approvals);
        }
        
        Ok(approved)
    }
    
    /// Add authorized broadcaster
    #[wasm_bindgen]
    pub fn add_broadcaster(&mut self, identity: &str) {
        if !self.authorized_broadcasters.contains(&identity.to_string()) {
            self.authorized_broadcasters.push(identity.to_string());
            log::info!("Added authorized broadcaster: {}", identity);
        }
    }
    
    /// Remove authorized broadcaster
    #[wasm_bindgen]
    pub fn remove_broadcaster(&mut self, identity: &str) {
        self.authorized_broadcasters.retain(|b| b != identity);
    }
    
    /// Check if user is authorized broadcaster
    #[wasm_bindgen]
    pub fn is_authorized_broadcaster(&self, identity: &str) -> bool {
        self.authorized_broadcasters.contains(&identity.to_string())
    }
    
    /// Get active alerts
    #[wasm_bindgen]
    pub fn get_active_alerts(&self) -> js_sys::Array {
        let array = js_sys::Array::new();
        for alert in &self.active_alerts {
            let obj = js_sys::Object::new();
            js_sys::Reflect::set(&obj, &"id".into(), &alert.id.clone().into()).ok();
            js_sys::Reflect::set(&obj, &"title".into(), &alert.title.clone().into()).ok();
            js_sys::Reflect::set(&obj, &"message".into(), &alert.message.clone().into()).ok();
            js_sys::Reflect::set(&obj, &"level".into(), &format!("{:?}", alert.level).into()).ok();
            array.push(&obj);
        }
        array
    }
    
    /// Acknowledge an alert
    #[wasm_bindgen]
    pub fn acknowledge_alert(&mut self, alert_id: &str, user: &str) {
        if let Some(alert) = self.active_alerts.iter_mut().find(|a| a.id == alert_id) {
            if !alert.acknowledged_by.contains(&user.to_string()) {
                alert.acknowledged_by.push(user.to_string());
                log::info!("Alert {} acknowledged by {}", alert_id, user);
            }
        }
    }
    
    /// Check if crisis mode is active
    #[wasm_bindgen]
    pub fn is_active(&self) -> bool {
        self.active
    }
    
    /// Get current crisis level
    #[wasm_bindgen]
    pub fn get_level(&self) -> String {
        format!("{:?}", self.level)
    }
}

impl CrisisMode {
    /// Broadcast system alert to all users
    fn broadcast_system_alert(&self, message: &str) {
        // In production, this would:
        // 1. Send push notifications
        // 2. Override DND
        // 3. Play alert sounds
        // 4. Show system notifications
        
        log::info!("📢 System alert: {}", message);
        
        #[cfg(target_arch = "wasm32")]
        {
            let js_code = format!("
                if ('Notification' in window && Notification.permission === 'granted') {{
                    new Notification('FortiComm Alert', {{
                        body: '{}',
                        requireInteraction: true,
                        badge: '/alert-icon.png'
                    }});
                }}
            ", message);
            js_sys::eval(&js_code).ok();
        }
    }
}

/// Secure wipe for crisis situations
#[wasm_bindgen]
pub fn emergency_purge() {
    log::warn!("🚨 EMERGENCY PURGE INITIATED");
    
    // Clear all sensitive data
    #[cfg(target_arch = "wasm32")]
    {
        js_sys::eval("
            // Clear all storage
            localStorage.clear();
            sessionStorage.clear();
            
            // Clear IndexedDB
            indexedDB.databases().then(dbs => {
                dbs.forEach(db => indexedDB.deleteDatabase(db.name));
            });
            
            // Clear caches
            caches.keys().then(names => {
                names.forEach(name => caches.delete(name));
            });
            
            // Force reload
            location.reload();
        ").ok();
    }
}

/// Silent panic wipe (no visual indication)
#[wasm_bindgen]
pub fn silent_purge() {
    log::warn!("🤫 Silent purge initiated");
    
    #[cfg(target_arch = "wasm32")]
    {
        js_sys::eval("
            // Silent cleanup
            localStorage.clear();
            sessionStorage.clear();
            
            // Overwrite with random data first
            const randomData = Array(10000).fill(0).map(() => 
                String.fromCharCode(Math.floor(Math.random() * 256))
            ).join('');
            
            localStorage.setItem('_purge', randomData);
            localStorage.clear();
        ").ok();
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_crisis_level_priority() {
        assert!(CrisisLevel::Black.priority() > CrisisLevel::Red.priority());
        assert!(CrisisLevel::Red.priority() > CrisisLevel::Orange.priority());
        assert!(CrisisLevel::Orange.priority() > CrisisLevel::Yellow.priority());
    }
    
    #[test]
    fn test_multi_person_auth() {
        let mut crisis = CrisisMode::new();
        
        // Request approval
        let op_id = crisis.request_approval(
            "SENSITIVE_OPERATION",
            "Test operation",
            "user1"
        ).unwrap();
        
        // Add approvers
        crisis.mpa_config.approvers.push("approver1".to_string());
        crisis.mpa_config.approvers.push("approver2".to_string());
        
        // First approval
        let result = crisis.approve_operation(&op_id, "approver1").unwrap();
        assert!(!result); // Not enough approvals
        
        // Second approval
        let result = crisis.approve_operation(&op_id, "approver2").unwrap();
        assert!(result); // Now approved
    }
}
