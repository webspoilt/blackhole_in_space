/**
 * CivicAI - Government Chatbot Framework
 * 
 * AI-powered citizen services with:
 * - RAG (Retrieval Augmented Generation) from official sources
 * - Human-in-the-loop for sensitive decisions
 * - Multi-language support
 * - Full audit trail
 */

import { VectorStore } from './vector-store';
import { KnowledgeBase } from './knowledge-base';

export interface CivicAIBot {
  id: string;
  name: string;
  department: string;
  jurisdiction: string;
  knowledgeBase: KnowledgeBase;
  services: CitizenService[];
  guardrails: SafetyGuardrails;
}

export interface CitizenService {
  id: string;
  name: string;
  description: string;
  api: ServiceAPI;
  requiredInfo: string[];
  humanEscalation: boolean;
}

export interface ServiceAPI {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  auth: 'none' | 'bearer' | 'api-key';
}

export interface SafetyGuardrails {
  noPoliticalOpinions: boolean;
  citeSources: boolean;
  humanEscalation: boolean;
  maxResponseTime: number; // milliseconds
  prohibitedTopics: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot' | 'human-agent';
  content: string;
  timestamp: number;
  sources?: Source[];
  confidence?: number;
  escalated?: boolean;
}

export interface Source {
  title: string;
  url: string;
  excerpt: string;
}

/**
 * CivicAI Bot Manager
 */
export class CivicAIBotManager {
  private bots: Map<string, CivicAIBot> = new Map();
  private vectorStore: VectorStore;
  private conversations: Map<string, ChatMessage[]> = new Map();

  constructor() {
    this.vectorStore = new VectorStore();
  }

  /**
   * Register a new government bot
   */
  registerBot(bot: CivicAIBot): void {
    this.bots.set(bot.id, bot);
    console.log(`🤖 Registered bot: ${bot.name} (${bot.department})`);
  }

  /**
   * Process citizen inquiry with RAG
   */
  async processInquiry(
    botId: string,
    userMessage: string,
    userId: string
  ): Promise<ChatMessage> {
    const bot = this.bots.get(botId);
    if (!bot) {
      throw new Error(`Bot ${botId} not found`);
    }

    // Get conversation history
    const conversationId = `${botId}-${userId}`;
    const history = this.conversations.get(conversationId) || [];

    // 1. Retrieve relevant documents (RAG)
    const relevantDocs = await this.vectorStore.search(userMessage, 5);

    // 2. Check if this is a service request
    const serviceMatch = this.matchService(bot, userMessage);

    // 3. Generate response
    let response: ChatMessage;

    if (serviceMatch) {
      // Handle service request
      response = await this.handleServiceRequest(
        bot,
        serviceMatch,
        userMessage,
        userId
      );
    } else {
      // General inquiry with RAG
      response = await this.generateRAGResponse(
        bot,
        userMessage,
        relevantDocs,
        history
      );
    }

    // 4. Check for escalation
    if (this.shouldEscalate(bot, userMessage, response)) {
      response.escalated = true;
      await this.escalateToHuman(bot, conversationId, userMessage);
    }

    // 5. Store conversation
    history.push({
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    });
    history.push(response);
    this.conversations.set(conversationId, history);

    return response;
  }

  /**
   * Generate RAG-based response
   */
  private async generateRAGResponse(
    bot: CivicAIBot,
    query: string,
    documents: any[],
    history: ChatMessage[]
  ): Promise<ChatMessage> {
    // Build context from retrieved documents
    const context = documents.map((doc, i) => 
      `[${i + 1}] ${doc.content}`
    ).join('\n\n');

    // Build sources
    const sources: Source[] = documents.map(doc => ({
      title: doc.metadata.title,
      url: doc.metadata.url,
      excerpt: doc.content.substring(0, 200) + '...',
    }));

    // Generate response using local LLM
    const prompt = this.buildPrompt(bot, query, context, history);
    
    // In production, this would call local LLM
    const response = await this.callLocalLLM(prompt);

    return {
      id: `bot-${Date.now()}`,
      role: 'bot',
      content: response,
      timestamp: Date.now(),
      sources: bot.guardrails.citeSources ? sources : undefined,
      confidence: this.calculateConfidence(documents),
    };
  }

  /**
   * Build prompt for LLM
   */
  private buildPrompt(
    bot: CivicAIBot,
    query: string,
    context: string,
    history: ChatMessage[]
  ): string {
    const historyStr = history.slice(-5).map(h => 
      `${h.role}: ${h.content}`
    ).join('\n');

    return `You are ${bot.name}, an AI assistant for ${bot.department}.

CRITICAL INSTRUCTIONS:
- Answer ONLY based on the provided context
- If you don't know, say "I don't have that information"
- NEVER make up facts or policies
- Cite sources when providing information
- Do not express political opinions
- Be helpful, accurate, and concise

CONTEXT:
${context}

CONVERSATION HISTORY:
${historyStr}

CITIZEN QUESTION: ${query}

YOUR RESPONSE:`;
  }

  /**
   * Match user query to available services
   */
  private matchService(
    bot: CivicAIBot,
    message: string
  ): CitizenService | null {
    const lower = message.toLowerCase();

    for (const service of bot.services) {
      // Check for service keywords
      const keywords = service.name.toLowerCase().split(' ');
      const matches = keywords.filter(k => lower.includes(k)).length;
      
      if (matches >= 2 || lower.includes(service.name.toLowerCase())) {
        return service;
      }
    }

    return null;
  }

  /**
   * Handle service-specific request
   */
  private async handleServiceRequest(
    bot: CivicAIBot,
    service: CitizenService,
    message: string,
    userId: string
  ): Promise<ChatMessage> {
    // Extract required information
    const extractedInfo = this.extractInformation(message, service.requiredInfo);

    // Check if all required info is present
    const missingInfo = service.requiredInfo.filter(
      field => !extractedInfo[field]
    );

    if (missingInfo.length > 0) {
      return {
        id: `bot-${Date.now()}`,
        role: 'bot',
        content: `To help you with ${service.name}, I'll need: ${missingInfo.join(', ')}.`,
        timestamp: Date.now(),
      };
    }

    // Call service API
    try {
      const result = await this.callServiceAPI(service, extractedInfo, userId);
      
      return {
        id: `bot-${Date.now()}`,
        role: 'bot',
        content: result.message,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        id: `bot-${Date.now()}`,
        role: 'bot',
        content: `I'm having trouble accessing that service. Let me connect you with a human agent.`,
        timestamp: Date.now(),
        escalated: true,
      };
    }
  }

  /**
   * Extract information from user message
   */
  private extractInformation(
    message: string,
    fields: string[]
  ): Record<string, string> {
    const extracted: Record<string, string> = {};
    
    // Simple extraction patterns
    const patterns: Record<string, RegExp> = {
      'permit number': /permit[:\s]+([A-Z0-9-]+)/i,
      'case number': /case[:\s]+([A-Z0-9-]+)/i,
      'address': /(\d+\s+[^,]+(?:,\s*[^,]+)?)/i,
      'date': /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
      'email': /([\w.-]+@[\w.-]+\.\w+)/i,
      'phone': /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/i,
    };

    for (const field of fields) {
      const pattern = patterns[field.toLowerCase()];
      if (pattern) {
        const match = message.match(pattern);
        if (match) {
          extracted[field] = match[1];
        }
      }
    }

    return extracted;
  }

  /**
   * Call service API
   */
  private async callServiceAPI(
    service: CitizenService,
    params: Record<string, string>,
    userId: string
  ): Promise<{ message: string; data?: any }> {
    const { api } = service;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (api.auth === 'bearer') {
      headers['Authorization'] = `Bearer ${process.env.GOV_API_TOKEN}`;
    } else if (api.auth === 'api-key') {
      headers['X-API-Key'] = process.env.GOV_API_KEY || '';
    }

    const response = await fetch(api.endpoint, {
      method: api.method,
      headers,
      body: api.method !== 'GET' ? JSON.stringify(params) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      message: this.formatServiceResponse(service, data),
      data,
    };
  }

  /**
   * Format service response
   */
  private formatServiceResponse(
    service: CitizenService,
    data: any
  ): string {
    switch (service.id) {
      case 'permit-status':
        return `Your permit application (ID: ${data.permitId}) is currently **${data.status}**. ` +
               `Expected completion: ${data.estimatedDate}. ` +
               `For questions, contact ${data.contactInfo}.`;
      
      case 'tax-inquiry':
        return `Your tax account shows a balance of **$${data.balance}**. ` +
               `Last payment: ${data.lastPaymentDate}. ` +
               `Payment due: ${data.dueDate}.`;
      
      case 'appointment-booking':
        return `I've scheduled your appointment for **${data.date} at ${data.time}**. ` +
               `Location: ${data.location}. ` +
               `Confirmation: ${data.confirmationCode}.`;
      
      default:
        return `Here's what I found: ${JSON.stringify(data, null, 2)}`;
    }
  }

  /**
   * Determine if conversation should escalate to human
   */
  private shouldEscalate(
    bot: CivicAIBot,
    message: string,
    response: ChatMessage
  ): boolean {
    // Check guardrails
    if (!bot.guardrails.humanEscalation) {
      return false;
    }

    const lower = message.toLowerCase();

    // Escalation triggers
    const triggers = [
      'complaint',
      'lawsuit',
      'lawyer',
      'attorney',
      'discrimination',
      'harassment',
      'threat',
      'emergency',
      'life threatening',
      'suicide',
      'hurt myself',
    ];

    for (const trigger of triggers) {
      if (lower.includes(trigger)) {
        return true;
      }
    }

    // Low confidence response
    if (response.confidence && response.confidence < 0.5) {
      return true;
    }

    // User explicitly asked for human
    if (lower.includes('human') || lower.includes('agent') || lower.includes('representative')) {
      return true;
    }

    return false;
  }

  /**
   * Escalate to human agent
   */
  private async escalateToHuman(
    bot: CivicAIBot,
    conversationId: string,
    userMessage: string
  ): Promise<void> {
    console.log(`🚨 Escalating conversation ${conversationId} to human agent`);
    
    // In production, this would:
    // 1. Add to human agent queue
    // 2. Notify available agents
    // 3. Transfer conversation context
    // 4. Log escalation for audit
  }

  /**
   * Call local LLM (on-device)
   */
  private async callLocalLLM(prompt: string): Promise<string> {
    // In production, this would call the local LLM WASM module
    // For now, return a placeholder
    return `[This is where the local LLM would generate a response based on the RAG context]`;
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(documents: any[]): number {
    if (documents.length === 0) return 0;
    
    // Average similarity scores
    const totalScore = documents.reduce((sum, doc) => sum + (doc.score || 0), 0);
    return totalScore / documents.length;
  }

  /**
   * Get conversation history
   */
  getConversation(botId: string, userId: string): ChatMessage[] {
    return this.conversations.get(`${botId}-${userId}`) || [];
  }

  /**
   * Export conversation for audit
   */
  exportConversation(botId: string, userId: string): string {
    const conversation = this.getConversation(botId, userId);
    return JSON.stringify({
      botId,
      userId,
      exportedAt: new Date().toISOString(),
      messages: conversation,
    }, null, 2);
  }
}

/**
 * Pre-configured government bots
 */
export const GovernmentBots = {
  /**
   * City Services Bot
   */
  cityServices: (): CivicAIBot => ({
    id: 'city-services',
    name: 'City Assistant',
    department: 'City Hall',
    jurisdiction: 'Municipal',
    knowledgeBase: new KnowledgeBase([
      'city-codes.pdf',
      'zoning-regulations.pdf',
      'permits-guide.pdf',
      'trash-schedule.pdf',
    ]),
    services: [
      {
        id: 'permit-status',
        name: 'Permit Status Check',
        description: 'Check the status of building permits',
        api: {
          endpoint: '/api/permits/status',
          method: 'GET',
          auth: 'bearer',
        },
        requiredInfo: ['permit number'],
        humanEscalation: false,
      },
      {
        id: 'trash-pickup',
        name: 'Trash Pickup Schedule',
        description: 'Find trash and recycling pickup days',
        api: {
          endpoint: '/api/waste/schedule',
          method: 'GET',
          auth: 'none',
        },
        requiredInfo: ['address'],
        humanEscalation: false,
      },
      {
        id: 'report-issue',
        name: 'Report City Issue',
        description: 'Report potholes, graffiti, etc.',
        api: {
          endpoint: '/api/issues/report',
          method: 'POST',
          auth: 'bearer',
        },
        requiredInfo: ['address', 'issue type'],
        humanEscalation: true,
      },
    ],
    guardrails: {
      noPoliticalOpinions: true,
      citeSources: true,
      humanEscalation: true,
      maxResponseTime: 5000,
      prohibitedTopics: ['politics', 'elections', 'candidates'],
    },
  }),

  /**
   * Tax Department Bot
   */
  taxDepartment: (): CivicAIBot => ({
    id: 'tax-dept',
    name: 'Tax Assistant',
    department: 'Revenue Department',
    jurisdiction: 'State',
    knowledgeBase: new KnowledgeBase([
      'tax-codes.pdf',
      'filing-guide.pdf',
      'deductions-list.pdf',
    ]),
    services: [
      {
        id: 'tax-inquiry',
        name: 'Tax Account Inquiry',
        description: 'Check tax balance and payments',
        api: {
          endpoint: '/api/tax/account',
          method: 'GET',
          auth: 'bearer',
        },
        requiredInfo: ['account number'],
        humanEscalation: false,
      },
      {
        id: 'payment-plan',
        name: 'Payment Plan Setup',
        description: 'Set up installment payments',
        api: {
          endpoint: '/api/tax/payment-plan',
          method: 'POST',
          auth: 'bearer',
        },
        requiredInfo: ['account number', 'amount'],
        humanEscalation: true,
      },
    ],
    guardrails: {
      noPoliticalOpinions: true,
      citeSources: true,
      humanEscalation: true,
      maxResponseTime: 10000,
      prohibitedTopics: ['politics'],
    },
  }),

  /**
   * Emergency Services Bot
   */
  emergencyServices: (): CivicAIBot => ({
    id: 'emergency-services',
    name: 'Emergency Assistant',
    department: 'Emergency Management',
    jurisdiction: 'Regional',
    knowledgeBase: new KnowledgeBase([
      'emergency-procedures.pdf',
      'evacuation-routes.pdf',
      'shelter-locations.pdf',
    ]),
    services: [
      {
        id: 'emergency-alert',
        name: 'Emergency Alert',
        description: 'Get current emergency alerts',
        api: {
          endpoint: '/api/emergency/alerts',
          method: 'GET',
          auth: 'none',
        },
        requiredInfo: ['location'],
        humanEscalation: false,
      },
      {
        id: 'evacuation-info',
        name: 'Evacuation Information',
        description: 'Find evacuation routes and shelters',
        api: {
          endpoint: '/api/emergency/evacuation',
          method: 'GET',
          auth: 'none',
        },
        requiredInfo: ['address'],
        humanEscalation: false,
      },
    ],
    guardrails: {
      noPoliticalOpinions: true,
      citeSources: true,
      humanEscalation: true,
      maxResponseTime: 2000, // Fast response for emergencies
      prohibitedTopics: ['politics', 'non-emergency'],
    },
  }),
};
