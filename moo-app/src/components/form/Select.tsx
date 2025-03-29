import classNames from "classnames";
import { useFormGroup } from "./FormGroupProvider";
import React from "react";
import { useFormContext } from "react-hook-form";

export type SelectComponent = React.FC<SelectProps>;

export const Select: SelectComponent = React.forwardRef(({ className, id, ...rest }) => {

    const group = useFormGroup();
    const { register } = useFormContext();

    id = id ?? group.groupId;

    return (
        <select id={id} className={classNames("form-select", className)} {...rest} {...register(id)} />
    );
});

Select.displayName = "Select";

export interface SelectProps extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
}