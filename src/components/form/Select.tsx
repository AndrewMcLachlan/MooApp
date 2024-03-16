import classNames from "classnames";
import { useFormGroup } from "./FormGroupProvider";
import React from "react";

export type SelectComponent = React.FC<SelectProps>;

export const Select: SelectComponent = React.forwardRef(({ className, id, ...rest }, ref) => {

    const group = useFormGroup();

    id = id ?? group.groupId;

    return (
        <select id={id} className={classNames("form-select", className)} {...rest} ref={ref} />
    );
});

export interface SelectProps extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
}
