import classNames from "classnames";
import { Icon } from "./Icon";
import type { PropsWithChildren } from "react";

export const Collapsible: React.FC<PropsWithChildren<CollapsibleProps>> = ({ headerAs = "span", header, children, className, ...props }) => {

    const HeaderAs = headerAs;

    return (
        <details {...props} className={classNames("collapsible", "section", className)}>
            <summary className="header">
                <HeaderAs><span className="collapsible-icon"><Icon icon="chevron-right" /></span>{header}</HeaderAs>
            </summary>
            <div className="collapsible-content">
                {children}
            </div>
        </details>
    );
}

export interface CollapsibleProps extends React.DetailedHTMLProps<React.DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement> {
    header: React.ReactNode;
    headerAs?: React.ElementType;
}