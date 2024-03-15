import { DetailedHTMLProps } from "react";
import { FromGroupProvider } from "./FormGroupProvider";

export type GroupComponent = React.FC<{ groupId: string } & DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>;

export const Group: GroupComponent = ({ children, groupId, ...props }) => (
    <FromGroupProvider groupId={groupId}>
        <div {...props}>
            {children}
        </div>
    </FromGroupProvider>
);
