import classNames from "classnames";
import { useFormGroup } from "./FormGroupProvider";
import React from "react";
import { useFormContext } from "react-hook-form";

export type TextAreaComponent = React.FC<TextAreaProps>;

export const TextArea: TextAreaComponent = React.forwardRef(({ className, id, ...rest }) => {

    const { register } = useFormContext();
    const group = useFormGroup();

    id = id ?? group.groupId;

    return (
        <textarea id={id} className={classNames("form-control", className)} {...rest} {...register(id)} />
    );
});

TextArea.displayName = "TextArea";

export interface TextAreaProps extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
}
