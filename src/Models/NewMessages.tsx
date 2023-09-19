import { User } from "./Users";

export interface NewMessages {
    User: User;
    Message: Message[]
}

interface Message {
    Author: string | null | undefined;
    NewMessage?: string
} 