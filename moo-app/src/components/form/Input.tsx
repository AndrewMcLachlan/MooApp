import classNames from "classnames";
import { useFormGroup } from "./FormGroupProvider";
import React from "react";
import { useFormContext } from "react-hook-form";
import { ClearableInput, ClearableInputProps } from "../ClearableInput";

export type InputComponent = React.FC<InputProps>;

export const Input: InputComponent = ({ className, id, ...rest }) => {

    const group = useFormGroup();
    const { register } = useFormContext();
    id = id ?? group.groupId;
    const innerClass = rest.type === "checkbox" ? "form-check-input" : "form-control";

    const Wrapper: React.ElementType = rest.type === "checkbox" ? "div" : React.Fragment;

    return (
        <Wrapper>
            <ClearableInput id={id} className={classNames(innerClass, className)} {...rest} {...register(id)} />
        </Wrapper>
    );
};

Input.displayName = "Input";

export interface InputProps extends ClearableInputProps {
}
