import classNames from "classnames";
import { useFormGroup } from "./FormGroupProvider";
import React from "react";

export const passwordMask = "*****************************";

export type PasswordComponent = React.FC<PasswordProps>;

export const Password: PasswordComponent = React.forwardRef(({ className, id, ...rest }, ref) => {

    const group = useFormGroup();
    id = id ?? group.groupId;
    const innerClass = "form-control";

    return (
        <input id={id} defaultValue={passwordMask} onFocus={(e) => e.currentTarget.value = e.currentTarget.value === passwordMask ? "" : e.currentTarget.value} className={classNames(innerClass, className)} type="password" {...rest} ref={ref} />
    );
});

export interface PasswordProps extends React.DetailedHTMLProps<Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">, HTMLInputElement> {

}
