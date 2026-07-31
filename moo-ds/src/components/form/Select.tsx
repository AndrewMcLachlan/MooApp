import classNames from "classnames";
import { useFormGroup } from "./FormGroupProvider";
import { useFieldValidity } from "./useFieldError";
import React from "react";
import { useFormContext } from "react-hook-form";

export type SelectComponent = React.FC<SelectProps>;

export const Select: SelectComponent = ({ className, id, ...rest }) => {

    const group = useFormGroup();
    const { register } = useFormContext();

    id = id ?? group.groupId;

    // Marks the control invalid for CSS and assistive technology when the

    // resolver has rejected it; :user-invalid only sees native constraints.

    const validity = useFieldValidity(id);


    return (
        <select id={id} {...validity} className={classNames("form-select", className)} {...rest} {...register(id)} />
    );
};

Select.displayName = "Select";

export interface SelectProps extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
}