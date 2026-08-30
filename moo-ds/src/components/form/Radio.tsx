import React from "react";
import classNames from "classnames";
import { useFormContext } from "react-hook-form";
import { useRadioGroup } from "./RadioGroup";
import { useFieldValidity } from "./useFieldError";

/**
 * One option within a `Form.RadioGroup`.
 *
 * Registers against the group's field name; its id is derived from that name and
 * its value.
 */
export const Radio: React.FC<RadioProps> = ({ label, value, id, className, ...rest }) => {

    const { name, appearance, variant } = useRadioGroup();
    const form = useFormContext();

    const inputId = id ?? (name !== undefined ? `${name}-${String(value)}` : undefined);
    const validity = useFieldValidity(name);

    // Usable outside a Form: with nothing to register against, the radio falls
    // back to an ordinary uncontrolled input.
    const registration = form && name ? form.register(name) : { name };

    const input = (
        <input
            type="radio"
            id={inputId}
            value={value}
            {...validity}
            className={classNames(appearance === "buttons" ? "btn-check" : "form-check-input", className)}
            {...rest}
            {...registration}
        />
    );

    // Input and label must stay siblings: .btn-check:checked + .btn selects the label.
    if (appearance === "buttons") {
        return (
            <>
                {input}
                <label htmlFor={inputId} className={classNames("btn", `btn-${variant}`)}>{label}</label>
            </>
        );
    }

    return (
        <div className="form-check">
            {input}
            {label && <label htmlFor={inputId} className="form-check-label">{label}</label>}
        </div>
    );
};

Radio.displayName = "Radio";

export interface RadioProps extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "type" | "name"> {
    /** Visible text for this option. */
    label?: React.ReactNode;
    /** The value submitted when this option is chosen. */
    value: string | number;
}
