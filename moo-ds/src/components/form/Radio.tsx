import React from "react";
import classNames from "classnames";
import { useFormContext } from "react-hook-form";
import { useRadioGroup } from "./RadioGroup";
import { useFieldValidity } from "./useFieldError";

/**
 * One option within a `Form.RadioGroup`.
 *
 * Registers against the *group's* name rather than its own id, which is what
 * makes the options one field instead of several. The id is derived from the
 * name and the value so each input still has a unique one for its label to
 * point at.
 */
export const Radio: React.FC<RadioProps> = ({ label, value, id, className, ...rest }) => {

    const { name, appearance, variant } = useRadioGroup();
    const form = useFormContext();

    const inputId = id ?? (name !== undefined ? `${name}-${String(value)}` : undefined);
    const validity = useFieldValidity(name);

    // Usable outside a Form: with nothing to register against the radio falls
    // back to an ordinary uncontrolled input, as the other form controls do.
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

    // The button appearance needs the input and its label as siblings so the
    // :checked + .btn rule can reach the label; a wrapper would break it.
    if (appearance === "buttons") {
        return (
            <>
                {input}
                {/* A bare .btn has a transparent background and border, so an
                    unselected option would render as plain text. The variant is
                    what gives it button chrome. */}
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
