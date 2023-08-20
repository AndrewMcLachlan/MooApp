import { NavItem } from "models";
import { Breadcrumb as BSBreadcrumb, BreadcrumbProps as BSBreadcrumbProps } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export const Breadcrumb: React.FC<BreadcrumbProps> = ({breadcrumbs, ...rest}) => (

    <BSBreadcrumb {...rest}>
        <LinkContainer to="/">
            <BSBreadcrumb.Item>Home</BSBreadcrumb.Item>
        </LinkContainer>
        {breadcrumbs.map((item, index) =>
            <LinkContainer key={index} to={item.route}>
                <BSBreadcrumb.Item>{item.text}</BSBreadcrumb.Item>
            </LinkContainer>
        )}
    </BSBreadcrumb>
);

Breadcrumb.displayName = "Breadcrumb";

Breadcrumb.defaultProps = {
    breadcrumbs: [],
};

export interface BreadcrumbProps extends BSBreadcrumbProps {
    breadcrumbs?: NavItem[];
}