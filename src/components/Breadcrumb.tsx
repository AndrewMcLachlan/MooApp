import { Breadcrumb as BSBreadcrumb, BreadcrumbProps as BSBreadcrumbProps } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export const Breadcrumb: React.FC<BreadcrumbProps> = ({breadcrumbs, ...rest}) => (

    <BSBreadcrumb {...rest}>
        <LinkContainer to="/">
            <BSBreadcrumb.Item>Home</BSBreadcrumb.Item>
        </LinkContainer>
        {breadcrumbs.map(([name, to]) =>
            <LinkContainer key={to} to={to}>
                <BSBreadcrumb.Item>{name}</BSBreadcrumb.Item>
            </LinkContainer>
        )}
    </BSBreadcrumb>
);

Breadcrumb.displayName = "Breadcrumb";

Breadcrumb.defaultProps = {
    breadcrumbs: [],
};

export interface BreadcrumbProps extends BSBreadcrumbProps {
    breadcrumbs?: [string, string][];
}