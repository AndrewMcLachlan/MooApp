import React, { DetailedHTMLProps } from "react";
import { FromGroupProvider } from "./FormGroupProvider";
import classNames from "classnames";

export type GroupComponent = React.FC<{ groupId: string, show?: boolean } & DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>;

export const Group: GroupComponent = ({ children, groupId, show = true, className, ...props }) => (
    show ? <FromGroupProvider groupId={groupId}>
        <div {...props} className={classNames(className, "form-group")}>
            {children}
        </div>
    </FromGroupProvider> : null
);

Group.displayName = "Group";
