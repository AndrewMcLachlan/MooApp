import classNames from "classnames";
import { Icon } from "./Icon";
import type { PropsWithChildren } from "react";

export const Collapsible: React.FC<PropsWithChildren<CollapsibleProps>> = ({ header, children, className, ...props }) => {
    return (
        <details {...props} className={classNames("collapsible", className)}>
            <summary>
                <span className="collapsible-icon"><Icon icon="chevron-right" /></span>
                {header}
            </summary>
            <div className="collapsible-content">
                {children}
            </div>
        </details>
    );
}

export interface CollapsibleProps extends React.DetailedHTMLProps<React.DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement> {
    header: React.ReactNode;
}