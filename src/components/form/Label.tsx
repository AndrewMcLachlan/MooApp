import classNames from "classnames";
import { useFormGroup } from "./FormGroupProvider";
import React from "react";

export type LabelComponent = React.FC<LabelProps>;

export const Label: LabelComponent = React.forwardRef(({ className, htmlFor, ...rest }, ref) => {

    const group = useFormGroup();

    htmlFor = htmlFor ?? group.groupId;

    return (
        <label htmlFor={htmlFor} className={classNames("form-label", className)} {...rest} ref={ref} />
    );
});

export interface LabelProps extends React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> {
}
