import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface Messages {
    sendMessage: (message: Message) => void;
    clearMessage: (key: string) => void;
    messages: Message[];
}

export interface Message {
    key?: string
    title?: string,
    icon?: IconProp,
    message: string,
    variant: "success" | "info" | "warning" | "danger",
}
