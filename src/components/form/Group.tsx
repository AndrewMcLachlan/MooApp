import { DetailedHTMLProps } from "react";

export type GroupComponent = React.FC<DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>;

export const Group: GroupComponent = ({ children, ...props }) => (
    <div {...props}>
        {children}
    </div>
);
