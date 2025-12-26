import type { Provider, ApiKeys } from "../stores/chat-store";

interface AIResponse {
  content: string;
  error?: string;
}

export class AIService {
  private apiKeys: ApiKeys;

  constructor(apiKeys: ApiKeys) {
    this.apiKeys = apiKeys;
  }

  async sendMessage(provider: Provider, message: string): Promise<AIResponse> {
    try {
      switch (provider) {
        case "deepseek":
          return await this.sendToDeepSeek(message);
        case "groq":
          return await this.sendToGroq(message);
        case "openai":
          return await this.sendToOpenAI(message);
        case "together":
          return await this.sendToTogether(message);
        default:
          return { content: "", error: "مزود غير مدعوم" };
      }
    } catch (error) {
      return {
        content: "",
        error: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
      };
    }
  }

  private async sendToDeepSeek(message: string): Promise<AIResponse> {
    if (!this.apiKeys.deepseek) {
      return { content: "", error: "مفتاح API لـ DeepSeek غير موجود" };
    }

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKeys.deepseek}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    return { content: data.choices[0]?.message?.content || "لا يوجد رد" };
  }

  private async sendToGroq(message: string): Promise<AIResponse> {
    if (!this.apiKeys.groq) {
      return { content: "", error: "مفتاح API لـ Groq غير موجود" };
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKeys.groq}`,
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return { content: data.choices[0]?.message?.content || "لا يوجد رد" };
  }

  private async sendToOpenAI(message: string): Promise<AIResponse> {
    if (!this.apiKeys.openai) {
      return { content: "", error: "مفتاح API لـ OpenAI غير موجود" };
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKeys.openai}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return { content: data.choices[0]?.message?.content || "لا يوجد رد" };
  }

  private async sendToTogether(message: string): Promise<AIResponse> {
    if (!this.apiKeys.together) {
      return { content: "", error: "مفتاح API لـ Together غير موجود" };
    }

    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKeys.together}`,
      },
      body: JSON.stringify({
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Together API error: ${response.statusText}`);
    }

    const data = await response.json();
    return { content: data.choices[0]?.message?.content || "لا يوجد رد" };
  }

  async testConnection(provider: Provider): Promise<boolean> {
    try {
      const response = await this.sendMessage(provider, "مرحبا");
      return !response.error;
    } catch {
      return false;
    }
  }
}
