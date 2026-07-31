import { useFormContext } from "react-hook-form";
import { useFormGroup } from "./FormGroupProvider";

// react-hook-form nests errors to match the field name, so "address.city"
// lands at errors.address.city rather than errors["address.city"].
const at = (source: unknown, path: string): unknown =>
    path.split(".").reduce<unknown>((value, key) => (value as Record<string, unknown>)?.[key], source);

/**
 * The validation message for a field, or undefined when it is valid.
 *
 * Defaults to the enclosing Form.Group's id, so a control inside a group does
 * not have to name itself.
 */
export const useFieldError = (id?: string): string | undefined => {
    const group = useFormGroup();
    // Not destructured: these components are exported on their own and can be
    // used outside a Form, where there is no context to destructure.
    const form = useFormContext();

    const name = id ?? group.groupId;
    if (!form || !name) return undefined;

    // Reading formState.errors here is what subscribes this component to
    // re-render when the field's validity changes -- formState is a proxy.
    const message = (at(form.formState.errors, name) as { message?: unknown } | undefined)?.message;

    return typeof message === "string" && message.length > 0 ? message : undefined;
};

/** The id Form.Feedback renders under, so a control can point at it. */
export const fieldErrorId = (name: string) => `${name}-error`;

/**
 * Accessibility attributes for a control whose field has failed validation.
 *
 * A react-hook-form rule never reaches the element's own validity state, so
 * :user-invalid cannot see it. aria-invalid gives the CSS something to match
 * and tells assistive technology the same thing, and aria-describedby points
 * at the message Form.Feedback renders.
 *
 * Empty when the field is valid, so nothing is added to a healthy control.
 */
export const useFieldValidity = (id?: string) => {
    const group = useFormGroup();
    const error = useFieldError(id);
    const name = id ?? group.groupId;

    if (!error || !name) return {};

    return { "aria-invalid": true as const, "aria-describedby": fieldErrorId(name) };
};
