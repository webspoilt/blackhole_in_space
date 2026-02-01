//! Local AI Assistant - "Sentinel"
//!
//! On-device AI for smart replies, summarization, and drafting.
//! NO data leaves the device - 100% local processing.

use wasm_bindgen::prelude::*;
use zeroize::{Zeroize, ZeroizeOnDrop};

/// AI personality types for different contexts
#[derive(Clone, Copy, Debug, PartialEq)]
pub enum AIPersonality {
    Professional,  // Formal, business-appropriate
    Casual,        // Friendly, conversational
    Empathetic,    // Supportive, understanding
    Authoritative, // Commanding, decisive
    Concise,       // Brief, to-the-point
}

impl Default for AIPersonality {
    fn default() -> Self {
        AIPersonality::Professional
    }
}

/// Message intent for context-aware replies
#[derive(Clone, Copy, Debug, PartialEq)]
pub enum MessageIntent {
    Question,      // Needs an answer
    Request,       // Asking for something
    Urgent,        // Time-sensitive
    FYI,           // Information sharing
    Approval,      // Needs decision
    Social,        // Casual conversation
}

/// Tone for drafted responses
#[derive(Clone, Copy, Debug, PartialEq)]
pub enum Tone {
    Formal,
    Informal,
    Friendly,
    Serious,
    Enthusiastic,
    Apologetic,
}

/// Local AI Assistant - runs entirely on-device
#[wasm_bindgen]
pub struct LocalAI {
    /// User's learned writing style
    writing_style: WritingStyle,
    
    /// Recent conversation context
    context_window: Vec<ContextMessage>,
    
    /// Current personality setting
    personality: AIPersonality,
    
    /// Language for responses
    language: String,
    
    /// Whether AI is enabled
    enabled: bool,
}

/// User's writing style profile
#[derive(Clone, Debug, Zeroize, ZeroizeOnDrop)]
struct WritingStyle {
    /// Common phrases used
    #[zeroize(skip)]
    common_phrases: Vec<String>,
    
    /// Average message length
    #[zeroize(skip)]
    avg_length: usize,
    
    /// Uses emojis frequently
    #[zeroize(skip)]
    uses_emojis: bool,
    
    /// Uses punctuation style
    #[zeroize(skip)]
    punctuation_style: PunctuationStyle,
    
    /// Formal vs casual ratio
    #[zeroize(skip)]
    formality_score: f32,
}

#[derive(Clone, Copy, Debug)]
enum PunctuationStyle {
    Minimal,   // "ok got it"
    Standard,  // "Okay, got it."
    Expressive, // "Okay! Got it!!!"
}

/// Context message for AI understanding
#[derive(Clone, Debug)]
struct ContextMessage {
    sender: String,
    content: String,
    timestamp: u64,
    intent: Option<MessageIntent>,
}

#[wasm_bindgen]
impl LocalAI {
    /// Create new AI assistant
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        LocalAI {
            writing_style: WritingStyle {
                common_phrases: vec![],
                avg_length: 50,
                uses_emojis: false,
                punctuation_style: PunctuationStyle::Standard,
                formality_score: 0.7,
            },
            context_window: vec![],
            personality: AIPersonality::Professional,
            language: "en".to_string(),
            enabled: true,
        }
    }
    
    /// Generate smart reply suggestions
    /// 
    /// # Arguments
    /// * `message` - The incoming message to respond to
    /// * `count` - Number of suggestions to generate (1-5)
    /// 
    /// # Returns
    /// Array of suggested replies
    #[wasm_bindgen]
    pub fn suggest_replies(&self, message: &str, count: usize) -> Result<js_sys::Array, JsValue> {
        if !self.enabled {
            return Ok(js_sys::Array::new());
        }
        
        let intent = self.analyze_intent(message);
        let suggestions = self.generate_suggestions(message, intent, count.min(5));
        
        let array = js_sys::Array::new();
        for suggestion in suggestions {
            array.push(&JsValue::from_str(&suggestion));
        }
        
        Ok(array)
    }
    
    /// Summarize a conversation
    #[wasm_bindgen]
    pub fn summarize(&self, conversation_json: &str) -> Result<String, JsValue> {
        // Parse conversation
        let messages: Vec<ContextMessage> = serde_json::from_str(conversation_json)
            .map_err(|e| JsValue::from_str(&format!("Parse error: {}", e)))?;
        
        if messages.is_empty() {
            return Ok("No messages to summarize.".to_string());
        }
        
        // Extract key points
        let key_points = self.extract_key_points(&messages);
        
        // Generate summary
        let summary = format!(
            "📋 **Conversation Summary** ({} messages)\n\n{}",
            messages.len(),
            key_points.join("\n")
        );
        
        Ok(summary)
    }
    
    /// Draft a professional response
    #[wasm_bindgen]
    pub fn draft_reply(&self, 
        context_json: &str,
        tone_str: &str,
        intent_str: &str
    ) -> Result<String, JsValue> {
        let tone = self.parse_tone(tone_str)?;
        let intent = self.parse_intent(intent_str)?;
        
        // Parse context
        let context: Vec<ContextMessage> = serde_json::from_str(context_json)
            .map_err(|e| JsValue::from_str(&format!("Parse error: {}", e)))?;
        
        // Generate draft
        let draft = self.compose_draft(&context, tone, intent);
        
        Ok(draft)
    }
    
    /// Set AI personality
    #[wasm_bindgen]
    pub fn set_personality(&mut self, personality: &str) -> Result<(), JsValue> {
        self.personality = match personality {
            "professional" => AIPersonality::Professional,
            "casual" => AIPersonality::Casual,
            "empathetic" => AIPersonality::Empathetic,
            "authoritative" => AIPersonality::Authoritative,
            "concise" => AIPersonality::Concise,
            _ => return Err(JsValue::from_str("Invalid personality")),
        };
        Ok(())
    }
    
    /// Learn from user's messages
    #[wasm_bindgen]
    pub fn learn_style(&mut self, user_messages_json: &str) -> Result<(), JsValue> {
        let messages: Vec<String> = serde_json::from_str(user_messages_json)
            .map_err(|e| JsValue::from_str(&format!("Parse error: {}", e)))?;
        
        // Analyze writing patterns
        self.analyze_writing_style(&messages);
        
        log::info!("AI learned user's writing style from {} messages", messages.len());
        Ok(())
    }
    
    /// Enable/disable AI
    #[wasm_bindgen]
    pub fn set_enabled(&mut self, enabled: bool) {
        self.enabled = enabled;
    }
    
    /// Check if AI is enabled
    #[wasm_bindgen]
    pub fn is_enabled(&self) -> bool {
        self.enabled
    }
}

impl LocalAI {
    /// Analyze message intent
    fn analyze_intent(&self, message: &str) -> MessageIntent {
        let lower = message.to_lowercase();
        
        if lower.contains("?") || lower.starts_with("what") || 
           lower.starts_with("how") || lower.starts_with("when") ||
           lower.starts_with("where") || lower.starts_with("why") ||
           lower.starts_with("can you") || lower.starts_with("could you") {
            MessageIntent::Question
        } else if lower.contains("urgent") || lower.contains("asap") ||
                  lower.contains("emergency") || lower.contains("immediately") {
            MessageIntent::Urgent
        } else if lower.contains("please") || lower.contains("can you") ||
                  lower.contains("need you to") {
            MessageIntent::Request
        } else if lower.contains("approve") || lower.contains("sign off") ||
                  lower.contains("decision") {
            MessageIntent::Approval
        } else if lower.contains("fyi") || lower.contains("for your information") ||
                  lower.contains("update") {
            MessageIntent::FYI
        } else {
            MessageIntent::Social
        }
    }
    
    /// Generate reply suggestions based on intent
    fn generate_suggestions(&self, message: &str, intent: MessageIntent, count: usize) -> Vec<String> {
        let mut suggestions = vec![];
        
        match intent {
            MessageIntent::Question => {
                suggestions.push("I'll look into that and get back to you shortly.".to_string());
                suggestions.push("Good question - let me find out.".to_string());
                suggestions.push("I'll check and follow up with you.".to_string());
                suggestions.push("Let me verify that information.".to_string());
            }
            MessageIntent::Urgent => {
                suggestions.push("Got it - handling this now.".to_string());
                suggestions.push("On it. Will update you in 10 minutes.".to_string());
                suggestions.push("Received - prioritizing this.".to_string());
            }
            MessageIntent::Request => {
                suggestions.push("Sure, I can do that.".to_string());
                suggestions.push("Will do.".to_string());
                suggestions.push("Absolutely, I'll take care of it.".to_string());
                suggestions.push("No problem, consider it done.".to_string());
            }
            MessageIntent::Approval => {
                suggestions.push("Approved - moving forward.".to_string());
                suggestions.push("Looks good to me. ✅".to_string());
                suggestions.push("Approved with minor comments.".to_string());
                suggestions.push("Need to review - will get back to you.".to_string());
            }
            MessageIntent::FYI => {
                suggestions.push("Thanks for the update.".to_string());
                suggestions.push("Noted.".to_string());
                suggestions.push("Got it, thanks.".to_string());
                suggestions.push("Appreciate the heads up.".to_string());
            }
            MessageIntent::Social => {
                suggestions.push("Sounds good!".to_string());
                suggestions.push("Great, talk soon.".to_string());
                suggestions.push("Thanks!".to_string());
                suggestions.push("Perfect 👍".to_string());
            }
        }
        
        // Apply personality
        suggestions = suggestions.into_iter()
            .map(|s| self.apply_personality(&s))
            .collect();
        
        // Return requested count
        suggestions.truncate(count);
        suggestions
    }
    
    /// Apply personality to suggestion
    fn apply_personality(&self, text: &str) -> String {
        match self.personality {
            AIPersonality::Professional => text.to_string(),
            AIPersonality::Casual => text.to_lowercase(),
            AIPersonality::Empathetic => format!("{}", text),
            AIPersonality::Authoritative => text.to_string(),
            AIPersonality::Concise => text.split('.').next().unwrap_or(text).to_string(),
        }
    }
    
    /// Extract key points from conversation
    fn extract_key_points(&self, messages: &[ContextMessage]) -> Vec<String> {
        let mut points = vec![];
        
        // Extract action items
        let action_items: Vec<_> = messages.iter()
            .filter(|m| {
                let lower = m.content.to_lowercase();
                lower.contains("need to") || lower.contains("should") ||
                lower.contains("will") || lower.contains("action")
            })
            .collect();
        
        if !action_items.is_empty() {
            points.push("🎯 **Action Items:**".to_string());
            for item in action_items.iter().take(3) {
                points.push(format!("  • {}", item.content.chars().take(80).collect::<String>()));
            }
        }
        
        // Extract decisions
        let decisions: Vec<_> = messages.iter()
            .filter(|m| {
                let lower = m.content.to_lowercase();
                lower.contains("decided") || lower.contains("agreed") ||
                lower.contains("approved") || lower.contains("consensus")
            })
            .collect();
        
        if !decisions.is_empty() {
            points.push("\n✅ **Decisions Made:**".to_string());
            for decision in decisions.iter().take(3) {
                points.push(format!("  • {}", decision.content.chars().take(80).collect::<String>()));
            }
        }
        
        // Extract questions
        let questions: Vec<_> = messages.iter()
            .filter(|m| m.content.contains('?'))
            .collect();
        
        if !questions.is_empty() {
            points.push("\n❓ **Open Questions:**".to_string());
            for q in questions.iter().take(3) {
                points.push(format!("  • {}", q.content.chars().take(80).collect::<String>()));
            }
        }
        
        points
    }
    
    /// Compose a draft response
    fn compose_draft(&self, context: &[ContextMessage], tone: Tone, intent: MessageIntent) -> String {
        let last_message = context.last()
            .map(|m| m.content.clone())
            .unwrap_or_default();
        
        let greeting = match tone {
            Tone::Formal => "Hello",
            Tone::Informal => "Hi",
            Tone::Friendly => "Hey",
            _ => "Hi",
        };
        
        let body = match intent {
            MessageIntent::Question => "Thank you for reaching out. ",
            MessageIntent::Request => "I'd be happy to help with that. ",
            MessageIntent::Urgent => "I understand the urgency. ",
            _ => "",
        };
        
        let closing = match tone {
            Tone::Formal => "\n\nBest regards,",
            Tone::Friendly => "\n\nThanks,",
            _ => "\n\nThanks,",
        };
        
        format!("{}{}{}{}", greeting, body, closing, "")
    }
    
    /// Parse tone from string
    fn parse_tone(&self, tone: &str) -> Result<Tone, JsValue> {
        match tone {
            "formal" => Ok(Tone::Formal),
            "informal" => Ok(Tone::Informal),
            "friendly" => Ok(Tone::Friendly),
            "serious" => Ok(Tone::Serious),
            "enthusiastic" => Ok(Tone::Enthusiastic),
            "apologetic" => Ok(Tone::Apologetic),
            _ => Err(JsValue::from_str("Invalid tone")),
        }
    }
    
    /// Parse intent from string
    fn parse_intent(&self, intent: &str) -> Result<MessageIntent, JsValue> {
        match intent {
            "question" => Ok(MessageIntent::Question),
            "request" => Ok(MessageIntent::Request),
            "urgent" => Ok(MessageIntent::Urgent),
            "fyi" => Ok(MessageIntent::FYI),
            "approval" => Ok(MessageIntent::Approval),
            "social" => Ok(MessageIntent::Social),
            _ => Err(JsValue::from_str("Invalid intent")),
        }
    }
    
    /// Analyze user's writing style
    fn analyze_writing_style(&mut self, messages: &[String]) {
        if messages.is_empty() {
            return;
        }
        
        // Calculate average length
        let total_len: usize = messages.iter().map(|m| m.len()).sum();
        self.writing_style.avg_length = total_len / messages.len();
        
        // Check emoji usage
        let emoji_count: usize = messages.iter()
            .map(|m| m.chars().filter(|c| c.is_emoji()).count())
            .sum();
        self.writing_style.uses_emojis = emoji_count > messages.len();
        
        // Check formality
        let formal_words = ["regards", "sincerely", "dear", "please", "thank you"];
        let formal_count: usize = messages.iter()
            .map(|m| {
                let lower = m.to_lowercase();
                formal_words.iter().filter(|&&w| lower.contains(w)).count()
            })
            .sum();
        
        self.writing_style.formality_score = 
            (formal_count as f32 / messages.len() as f32).min(1.0);
    }
}

/// Trait for emoji detection
trait EmojiExt {
    fn is_emoji(&self) -> bool;
}

impl EmojiExt for char {
    fn is_emoji(&self) -> bool {
        // Simple emoji detection
        let c = *self as u32;
        (0x1F600..=0x1F64F).contains(&c) ||  // Emoticons
        (0x1F300..=0x1F5FF).contains(&c) ||  // Misc symbols
        (0x1F680..=0x1F6FF).contains(&c) ||  // Transport
        (0x2600..=0x26FF).contains(&c) ||    // Misc symbols
        (0x2700..=0x27BF).contains(&c)       // Dingbats
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_suggest_replies() {
        let ai = LocalAI::new();
        let suggestions = ai.suggest_replies("Can you help with this?", 3).unwrap();
        assert!(suggestions.length() > 0);
    }
    
    #[test]
    fn test_analyze_intent() {
        let ai = LocalAI::new();
        
        assert_eq!(ai.analyze_intent("What time is the meeting?"), MessageIntent::Question);
        assert_eq!(ai.analyze_intent("URGENT: Need your help!"), MessageIntent::Urgent);
        assert_eq!(ai.analyze_intent("Please review this document"), MessageIntent::Request);
    }
}
