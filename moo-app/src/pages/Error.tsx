import { ErrorFallback } from "components";
import { Page } from "layout";
import React from "react";
import { Container } from "react-bootstrap";
import { FallbackProps } from "react-error-boundary";
import { useNavigate } from "react-router-dom";

export const Error: React.FC<FallbackProps> = (props) => {

    const navigate = useNavigate();

    return (
        <Page title="Error">
            <Container className="error-page">
                <ErrorFallback {...props} onClose={() => navigate(-1)} dismissable message="Close this alert to go back to the previous page." />
            </Container>
        </Page>
    );
}
