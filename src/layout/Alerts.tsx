import { useMessages } from "../providers"
import { Alert, Button } from "react-bootstrap";

export const Alerts = () => {
    const messages = useMessages();

    return (
        <div className="alerts">
            {messages?.messages.map(m => (
                <Alert key={m.key} dismissible variant={m.variant} show onClose={() => messages?.clearMessage(m.key)}>
                    {m.message}
                </Alert>
            ))}
        </div>
    );
}
