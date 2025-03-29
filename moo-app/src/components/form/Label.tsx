import classNames from "classnames";
import { useFormGroup } from "./FormGroupProvider";
import React from "react";

export type LabelComponent = React.FC<LabelProps>;

export const Label: LabelComponent = ({ className, htmlFor, ...rest }) => {

    const group = useFormGroup();

    htmlFor = htmlFor ?? group.groupId;

    return (
        <label htmlFor={htmlFor} className={classNames("form-label", className)} {...rest} />
    );
};

Label.displayName = "Label";

export interface LabelProps extends React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> {
}
