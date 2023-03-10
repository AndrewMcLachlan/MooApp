import { Breadcrumb as BSBreadcrumb, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export const Breadcrumb: React.FC<BreadcrumbProps> = (props) => (

    <header className="breadcrumb-container" hidden={!props.show}>
        <Container>
            <BSBreadcrumb>
                <LinkContainer to="/">
                    <BSBreadcrumb.Item>Home</BSBreadcrumb.Item>
                </LinkContainer>
                {props.breadcrumbs.map(([name, to]) =>
                    <LinkContainer key={to} to={to}>
                        <BSBreadcrumb.Item>{name}</BSBreadcrumb.Item>
                    </LinkContainer>
                )}
            </BSBreadcrumb>
        </Container>
    </header>
);

Breadcrumb.displayName = "Breadcrumb";

Breadcrumb.defaultProps = {
    show: true,
    breadcrumbs: [],
};

export interface BreadcrumbProps {
    show?: boolean;
    breadcrumbs?: [string, string][];
}