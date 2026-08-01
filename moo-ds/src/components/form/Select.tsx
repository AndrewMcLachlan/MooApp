import classNames from "classnames";
import { useFormGroup } from "./FormGroupProvider";
import { useFieldValidity } from "./useFieldError";
import React from "react";
import { useFormContext } from "react-hook-form";

export type SelectComponent = React.FC<SelectProps>;

export const Select: SelectComponent = ({ className, id, ...rest }) => {

    const group = useFormGroup();
    const form = useFormContext();

    id = id ?? group.groupId;

    // Marks the control invalid for CSS and assistive technology when the
    // resolver has rejected it; :user-invalid only sees native constraints.
    const validity = useFieldValidity(id);

    // Usable outside a Form: with no form to bind to there is nothing to
    // register, and the control falls back to an ordinary uncontrolled input.
    const registration = form && id ? form.register(id) : {};

    return (
        <select id={id} {...validity} className={classNames("form-select", className)} {...rest} {...registration} />
    );
};

Select.displayName = "Select";

export interface SelectProps extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
}