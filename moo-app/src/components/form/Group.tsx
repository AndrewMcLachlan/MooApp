import React, { DetailedHTMLProps } from "react";
import { FromGroupProvider } from "./FormGroupProvider";
import classNames from "classnames";

export type GroupComponent = React.FC<{ groupId: string } & DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>;

export const Group: GroupComponent = ({ children, groupId, className, ...props }) => (
    <FromGroupProvider groupId={groupId}>
        <div {...props} className={classNames(className, "form-group")}>
            {children}
        </div>
    </FromGroupProvider>
);

Group.displayName = "Group";
