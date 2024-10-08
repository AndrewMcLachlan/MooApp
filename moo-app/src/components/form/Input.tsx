import classNames from "classnames";
import { useFormGroup } from "./FormGroupProvider";
import React from "react";

export type InputComponent = React.FC<InputProps>;

export const Input: InputComponent = React.forwardRef(({ className, id, ...rest }, ref) => {

    const group = useFormGroup();
    id = id ?? group.groupId;
    const innerClass = rest.type === "checkbox" ? "form-check-input" : "form-control";

    return (
        <input id={id} className={classNames(innerClass, className)} {...rest} ref={ref} />
    );
});

Input.displayName = "Input";

export interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
}
