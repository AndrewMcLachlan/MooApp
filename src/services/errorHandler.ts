import { useMessages } from "providers/MessageProvider";

export const useErrorHandler = () => {

    const messages = useMessages();

    return  (error: Error) => {
        messages.sendMessage({ message: error.message ?? "An error has occurred", variant: "danger" });
    }
}
