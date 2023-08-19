import { useIsAuthenticated } from "@azure/msal-react";
import { PropsWithChildren } from "react";
import { Container } from "react-bootstrap";

export type MainComponent = React.FC<PropsWithChildren<unknown>>;

export const Main: MainComponent = ({ children }) => {

    const isAuthenticated = useIsAuthenticated();

    return (
        <Container fluid as="main">
            {isAuthenticated && children}
        </Container>
    );
};