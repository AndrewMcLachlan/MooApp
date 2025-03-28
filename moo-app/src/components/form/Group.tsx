import React, { DetailedHTMLProps } from "react";
import { FromGroupProvider } from "./FormGroupProvider";
import classNames from "classnames";

export type GroupComponent = React.FC<{ groupId: string } & DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>;

export const Group: GroupComponent = React.forwardRef(({ children, groupId, className, ...props }, ref) => (
    <FromGroupProvider groupId={groupId}>
        <div {...props} ref={ref} className={classNames(className, "form-group")}>
            {children}
        </div>
    </FromGroupProvider>
));

Group.displayName = "Group";
