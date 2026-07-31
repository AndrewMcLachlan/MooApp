import classNames from "classnames";
import { useFormGroup } from "./FormGroupProvider";
import { useFieldValidity } from "./useFieldError";
import React from "react";
import { useFormContext } from "react-hook-form";

export const passwordMask = "*****************************";

export type PasswordComponent = React.FC<PasswordProps>;

export const Password: PasswordComponent = ({ className, id, ...rest }) => {

    const { register } = useFormContext();
    const group = useFormGroup();
    id = id ?? group.groupId;
    const innerClass = "form-control";

    // Marks the control invalid for CSS and assistive technology when the

    // resolver has rejected it; :user-invalid only sees native constraints.

    const validity = useFieldValidity(id);


    return (
        <input id={id} {...validity} defaultValue={passwordMask} onFocus={(e) => e.currentTarget.value = e.currentTarget.value === passwordMask ? "" : e.currentTarget.value} className={classNames(innerClass, className)} type="password" {...rest} {...register(id)} />
    );
};

Password.displayName = "Password";

export interface PasswordProps extends React.DetailedHTMLProps<Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">, HTMLInputElement> {

}
