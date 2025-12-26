import AsyncStorage from "@react-native-async-storage/async-storage";

export type Provider = "deepseek" | "groq" | "openai" | "together";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  provider: Provider;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface ApiKeys {
  deepseek: string;
  groq: string;
  openai: string;
  together: string;
}

interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  apiKeys: ApiKeys;
  isLoading: boolean;
}

const STORAGE_KEY = "@neon_agent_hub:chats";
const API_KEYS_STORAGE_KEY = "@neon_agent_hub:api_keys";

let state: ChatState = {
  chats: [],
  currentChatId: null,
  apiKeys: {
    deepseek: "",
    groq: "",
    openai: "",
    together: "",
  },
  isLoading: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export const chatStore = {
  getState: () => state,

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  loadChats: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const chats = JSON.parse(data);
        state = { ...state, chats };
        emit();
      }
    } catch (error) {
      console.error("Failed to load chats:", error);
    }
  },

  loadApiKeys: async () => {
    try {
      const data = await AsyncStorage.getItem(API_KEYS_STORAGE_KEY);
      if (data) {
        const apiKeys = JSON.parse(data);
        state = { ...state, apiKeys };
        emit();
      }
    } catch (error) {
      console.error("Failed to load API keys:", error);
    }
  },

  saveChats: async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.chats));
    } catch (error) {
      console.error("Failed to save chats:", error);
    }
  },

  saveApiKeys: async (keys: ApiKeys) => {
    try {
      state = { ...state, apiKeys: keys };
      await AsyncStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(keys));
      emit();
    } catch (error) {
      console.error("Failed to save API keys:", error);
    }
  },

  createChat: (provider: Provider) => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "محادثة جديدة",
      provider,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    state = {
      ...state,
      chats: [newChat, ...state.chats],
      currentChatId: newChat.id,
    };
    chatStore.saveChats();
    emit();
    return newChat.id;
  },

  deleteChat: (chatId: string) => {
    state = {
      ...state,
      chats: state.chats.filter((chat) => chat.id !== chatId),
      currentChatId: state.currentChatId === chatId ? null : state.currentChatId,
    };
    chatStore.saveChats();
    emit();
  },

  addMessage: (chatId: string, message: Omit<Message, "id" | "timestamp">) => {
    const chat = state.chats.find((c) => c.id === chatId);
    if (!chat) return;

    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    chat.messages.push(newMessage);
    chat.updatedAt = Date.now();

    // Update title based on first user message
    if (chat.messages.length === 1 && message.role === "user") {
      chat.title = message.content.slice(0, 50);
    }

    state = { ...state, chats: [...state.chats] };
    chatStore.saveChats();
    emit();
  },

  setCurrentChat: (chatId: string | null) => {
    state = { ...state, currentChatId: chatId };
    emit();
  },

  setLoading: (isLoading: boolean) => {
    state = { ...state, isLoading };
    emit();
  },
};

// Initialize
chatStore.loadChats();
chatStore.loadApiKeys();
