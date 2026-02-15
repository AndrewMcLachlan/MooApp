import classNames from "classnames";
import React from "react";

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
}

export interface InputGroupTextProps extends React.HTMLAttributes<HTMLSpanElement> {
}

const InputGroupText: React.FC<React.PropsWithChildren<InputGroupTextProps>> = ({ className, children, ...rest }) => (
    <span className={classNames("input-group-text", className)} {...rest}>
        {children}
    </span>
);

InputGroupText.displayName = "InputGroup.Text";

const InputGroupComponent: React.FC<React.PropsWithChildren<InputGroupProps>> = ({ className, children, ...rest }) => (
    <div className={classNames("input-group", className)} {...rest}>
        {children}
    </div>
);

InputGroupComponent.displayName = "InputGroup";

export const InputGroup = Object.assign(InputGroupComponent, {
    Text: InputGroupText,
});
