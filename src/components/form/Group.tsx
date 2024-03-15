import { DetailedHTMLProps } from "react";
import { FromGroupProvider } from "./FormGroupProvider";

export type GroupComponent = React.FC<{ name: string } & DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>;

export const Group: GroupComponent = ({ children, name, ...props }) => (
    <FromGroupProvider groupId={name}>
        <div {...props}>
            {children}
        </div>
    </FromGroupProvider>
);
