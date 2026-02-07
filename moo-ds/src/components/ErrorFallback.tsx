import { Alert, AlertProps } from "react-bootstrap";
import { FallbackProps } from "react-error-boundary";

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary, message, dismissible, onClose }) => {

    return (
        <Alert variant="danger" dismissible={dismissible} onClose={(a,b) => { resetErrorBoundary(); onClose?.(a,b); }}>
            <Alert.Heading>Something went wrong</Alert.Heading>
            <pre>{error instanceof Error ? error.message : String(error)}</pre>
            {message && <p>{message}</p>}
            <p>

            </p>
        </Alert>
    );
}

export interface ErrorFallbackProps extends FallbackProps, Pick<AlertProps, "dismissible" | "onClose"> {
    message?: string;
}
