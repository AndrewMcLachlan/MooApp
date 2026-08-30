import React from "react";
import classNames from "classnames";
import { Input } from "./Input";
import { useFormGroup } from "./FormGroupProvider";

/**
 * A checkbox or radio bound to the surrounding form.
 *
 * For a set of radios answering one question, use `Form.RadioGroup`: it owns the
 * shared field name and gives the group an accessible name.
 */
export const Check: CheckComponent = ({ label, inline, id, className, type = "checkbox", ...rest }) => {

    const group = useFormGroup();
    const inputId = id ?? group.groupId;

    return (
        <div className={classNames("form-check", inline && "form-check-inline")}>
            <Input type={type} id={inputId} className={className} {...rest} />
            {label && <label htmlFor={inputId} className="form-check-label">{label}</label>}
        </div>
    );
};

Check.displayName = "Check";

export type CheckComponent = React.FC<CheckProps>;

export interface CheckProps extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "type"> {
    /** Visible text for the control. */
    label?: React.ReactNode;
    /** Lay the check out inline with its siblings rather than stacked. */
    inline?: boolean;
    /** Defaults to `checkbox`. A lone radio is rarely right -- see `Form.RadioGroup`. */
    type?: "checkbox" | "radio";
}
