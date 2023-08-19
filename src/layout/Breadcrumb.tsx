import { Breadcrumb as BreadcrumbComp } from "components";

export type BreadcrumbComponent = React.FC<BreadcrumbProps>;

export const Breadcrumb: BreadcrumbComponent = (props) => (

    <BreadcrumbComp className="top-breadcrumb" {...props} />
);

Breadcrumb.defaultProps = {
    hidden: false
}

export interface BreadcrumbProps {
    hidden?: boolean
}