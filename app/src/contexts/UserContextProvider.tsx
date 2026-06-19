import { createContext, type MiddlewareFunction, redirect } from "react-router";
import { api } from "../core/api";

type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  avatarUrl?: string;
  reputation: number;
  bio?: string;
};

const userContext = createContext<User|null>();

export const authMiddleware: MiddlewareFunction = async ({ context }) => {
  try {
    const response = await api.get<User>("/api/me");
    const user = response.data;

    context.set(userContext, user);
  } catch (error) {
        context.set(userContext, null);

  }
};

export { userContext };