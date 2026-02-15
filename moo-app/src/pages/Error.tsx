import { Container, ErrorFallback } from "@andrewmclachlan/moo-ds";
import { Page } from "../layout/Page";
import React from "react";
import { FallbackProps } from "react-error-boundary";
import { useNavigate } from "react-router";

export const Error: React.FC<FallbackProps> = (props) => {

    const navigate = useNavigate();

    return (
        <Page title="Error">
            <Container className="error-page">
                <ErrorFallback {...props} onClose={() => navigate(-1)} dismissible message="Close this alert to go back to the previous page." />
            </Container>
        </Page>
    );
}
