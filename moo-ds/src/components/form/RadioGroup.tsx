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
 * Renders a `<fieldset>` with the question as its `<legend>`, which is the only
 * markup that gives the group an accessible name: a `<label>` cannot, because
 * there is no single control for it to point at, and a heading sits near the
 * controls without being associated with them. Every option is announced with
 * the legend as its context.
 *
 * The group owns the field name so the radios register as one field. A lone
 * `Form.Check` registers against its own id, which is right for a checkbox and
 * wrong for a radio -- the options of one question must share a name.
 *
 * `appearance` changes only the skin. Both render the same radios with the same
 * semantics; `buttons` styles them as a joined button group for a small set of
 * short, mutually exclusive choices (a period switcher, a chart mode).
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
                {/* btn-group carries the joined-button styling the labels rely on.
                    The plain case just needs a row or a stack. */}
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
