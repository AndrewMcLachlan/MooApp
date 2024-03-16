import React, { DetailedHTMLProps } from "react";
import { FromGroupProvider } from "./FormGroupProvider";

export type GroupComponent = React.FC<{ groupId: string } & DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>;

export const Group: GroupComponent = React.forwardRef(({ children, groupId, ...props }, ref) => (
    <FromGroupProvider groupId={groupId}>
        <div {...props} ref={ref}>
            {children}
        </div>
    </FromGroupProvider>
));
