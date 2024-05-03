import { NavItem } from "models";
import { Breadcrumb as BSBreadcrumb, BreadcrumbProps as BSBreadcrumbProps } from "react-bootstrap";
import { Link } from "react-router-dom";

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ breadcrumbs = [], ...rest }) => (

    <BSBreadcrumb {...rest}>
        <BSBreadcrumb.Item linkProps={{ to: "/" }} linkAs={Link}>Home</BSBreadcrumb.Item>
        {breadcrumbs.map((item, index) =>
            <BSBreadcrumb.Item key={index} linkProps={{ to: item.route }} linkAs={Link}>{item.text}</BSBreadcrumb.Item>
        )}
    </BSBreadcrumb>
);

export interface BreadcrumbProps extends BSBreadcrumbProps {
    breadcrumbs?: NavItem[];
}
