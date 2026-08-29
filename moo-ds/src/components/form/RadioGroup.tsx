import React, { useContext } from "react";
import classNames from "classnames";
import { useFormGroup } from "./FormGroupProvider";
import type { ButtonVariant } from "../Button";

interface RadioGroupContextProps {
    /** The form field every radio in the group registers against. */
    name?: string;
    appearance: RadioGroupAppearance;
    /** Button variant for the buttons appearance. */
    variant: ButtonVariant;
}

const RadioGroupContext = React.createContext<RadioGroupContextProps>({ appearance: "check", variant: "outline-primary" });

export const useRadioGroup = () => useContext(RadioGroupContext);

export type RadioGroupAppearance = "check" | "buttons";

/**
 * A set of radios answering one question.
 *
 * Renders a `<fieldset>` with the question as its `<legend>`, which is what gives
 * the group its accessible name, and owns the field name so the options register
 * as one field.
 *
 * `appearance` changes only the skin: `buttons` styles the same radios as a joined
 * button group, for a short set of mutually exclusive choices.
 */
export const RadioGroup: React.FC<React.PropsWithChildren<RadioGroupProps>> = ({
    legend,
    appearance = "check",
    variant = "outline-primary",
    name,
    inline = false,
    className,
    children,
    ...rest
}) => {
    const group = useFormGroup();
    const fieldName = name ?? group.groupId;

    return (
        <RadioGroupContext.Provider value={{ name: fieldName, appearance, variant }}>
            <fieldset className={classNames("radio-group", className)} {...rest}>
                {legend && <legend>{legend}</legend>}
                <div className={classNames(
                    appearance === "buttons" ? "btn-group" : "radio-group-options",
                    appearance === "check" && inline && "radio-group-inline",
                )}
                    role={appearance === "buttons" ? "group" : undefined}
                >
                    {children}
                </div>
            </fieldset>
        </RadioGroupContext.Provider>
    );
};

RadioGroup.displayName = "RadioGroup";

export interface RadioGroupProps extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, "name"> {
    /** The question the options answer. Rendered as the group's `<legend>`. */
    legend?: React.ReactNode;
    /** `check` for standard radios, `buttons` for a joined button group. Defaults to `check`. */
    appearance?: RadioGroupAppearance;
    /** Button variant for `appearance="buttons"`. Defaults to `outline-primary`. */
    variant?: ButtonVariant;
    /** Field name. Defaults to the enclosing `Form.Group`'s `groupId`. */
    name?: string;
    /** Lay `check` options out in a row rather than stacked. Ignored for `buttons`. */
    inline?: boolean;
}
