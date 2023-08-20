import { Breadcrumb as BreadcrumbComp } from "components";
import { useLayout } from "providers";

export type BreadcrumbComponent = React.FC<BreadcrumbProps>;

export const Breadcrumb: BreadcrumbComponent = (props) => {

    const layout = useLayout();

    return (

        <BreadcrumbComp className="top-breadcrumb" {...props} breadcrumbs={layout.breadcrumbs} />
    );
};

Breadcrumb.defaultProps = {
    hidden: false
}

export interface BreadcrumbProps {
    hidden?: boolean
}