import { Container, ErrorFallback } from "@andrewmclachlan/moo-ds";
import { Page } from "../layout/Page";
import React from "react";
import { FallbackProps } from "react-error-boundary";
import { useRouter } from "@tanstack/react-router";

export const Error: React.FC<FallbackProps> = (props) => {

    const { history } = useRouter();

    return (
        <Page title="Error">
            <Container className="error-page">
                <ErrorFallback {...props} onClose={() => history.back()} dismissible message="Close this alert to go back to the previous page." />
            </Container>
        </Page>
    );
}
