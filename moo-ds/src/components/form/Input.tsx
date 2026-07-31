import classNames from "classnames";
import { useFormGroup } from "./FormGroupProvider";
import { useFieldValidity } from "./useFieldError";
import React from "react";
import { useFormContext } from "react-hook-form";
import { ClearableInput, type ClearableInputProps } from "../ClearableInput";

export type InputComponent = React.FC<InputProps>;

export const Input: InputComponent = ({ className, id, ...rest }) => {

    const group = useFormGroup();
    const { register } = useFormContext();
    id = id ?? group.groupId;
    const innerClass = rest.type === "checkbox" ? "form-check-input" : "form-control";

    // Marks the control invalid for CSS and assistive technology when the

    // resolver has rejected it; :user-invalid only sees native constraints.

    const validity = useFieldValidity(id);


    return (
        <ClearableInput id={id} {...validity} className={classNames(innerClass, className)} {...rest} {...register(id, {
            setValueAs(value) {
                if (rest.type === "number") {
                    return value ? Number(value) : undefined;
                }
                return value;
            },
        })} />
    );
};

Input.displayName = "Input";

export interface InputProps extends ClearableInputProps {
}
