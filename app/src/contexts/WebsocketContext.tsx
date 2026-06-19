import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import SockJS from "sockjs-client";
import { toast } from "sonner";
import Stomp from "stompjs";

export interface PostMessage {
  title: string;
  content: string;
  category: string;
  username?: string;
}

export interface CommentMessage {
  username: string;
  content: string;
  threadId: number;
}

interface WebSocketContextType {
  stompClient: Stomp.Client | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = new SockJS("http://localhost:8080/ws-forum");
    const client = Stomp.over(socket);

    const headers: any = token ? { "X-Authorization": `Bearer ${token}` } : {};

    client.connect(
      headers,
      () => {
        setStompClient(client);
        setIsConnected(true);
        if (client.connected) {
          toast.success("Connected to server!");
        }
      },
      (error) => {
        toast.error("Failed Connected to server!");
        console.error("Global WebSocket Error:", error);
        setIsConnected(false);
      },
    );

    return () => {
      if (client && client.connected) {
        client.disconnect(() => {});
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ stompClient, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}
