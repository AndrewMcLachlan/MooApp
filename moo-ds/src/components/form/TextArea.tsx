import classNames from "classnames";
import { useFormGroup } from "./FormGroupProvider";
import { useFieldValidity } from "./useFieldError";
import React from "react";
import { useFormContext } from "react-hook-form";

export type TextAreaComponent = React.FC<TextAreaProps>;

export const TextArea: TextAreaComponent = ({ className, id, ...rest }) => {

    const { register } = useFormContext();
    const group = useFormGroup();

    id = id ?? group.groupId;

    // Marks the control invalid for CSS and assistive technology when the

    // resolver has rejected it; :user-invalid only sees native constraints.

    const validity = useFieldValidity(id);


    return (
        <textarea id={id} {...validity} className={classNames("form-control", className)} {...rest} {...register(id)} />
    );
};

TextArea.displayName = "TextArea";

export interface TextAreaProps extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
}
