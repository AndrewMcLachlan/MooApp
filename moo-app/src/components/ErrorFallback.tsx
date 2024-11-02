import { Alert, AlertProps } from "react-bootstrap";
import { FallbackProps } from "react-error-boundary";

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary, message, dismissable, onClose }) => {

    return (
        <Alert variant="danger" dismissible={dismissable} onClose={() => { resetErrorBoundary(); onClose?.(); }}>
            <Alert.Heading>Something went wrong</Alert.Heading>
            <pre>{error.message}</pre>
            {message && <p>{message}</p>}
            <p>

            </p>
        </Alert>
    );
}

export interface ErrorFallbackProps extends FallbackProps, Pick<AlertProps, "dismissable" & "onClose"> {
    message?: string;
}
