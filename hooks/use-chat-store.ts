import { useSyncExternalStore } from "react";
import { chatStore } from "@/lib/stores/chat-store";

export function useChatStore() {
  return useSyncExternalStore(
    chatStore.subscribe,
    chatStore.getState,
    chatStore.getState
  );
}
