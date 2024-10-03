import classNames from "classnames";
import { useFormGroup } from "./FormGroupProvider";
import React from "react";

export type TextAreaComponent = React.FC<TextAreaProps>;

export const TextArea: TextAreaComponent = React.forwardRef(({ className, id, ...rest }, ref) => {

    const group = useFormGroup();

    id = id ?? group.groupId;

    return (
        <textarea id={id} className={classNames("form-control", className)} {...rest} ref={ref} />
    );
});

TextArea.displayName = "TextArea";

export interface TextAreaProps extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
}
