import classNames from "classnames";
import React from "react";
import { ClearableInput, ClearableInputProps } from "./ClearableInput";

export interface InputProps extends ClearableInputProps {
}

export interface InputCheckProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    label?: React.ReactNode;
    type?: "checkbox" | "radio";
    inline?: boolean;
}

export interface InputSwitchProps extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "type"> {
    label?: React.ReactNode;
}

const InputCheck = React.forwardRef<HTMLInputElement, InputCheckProps>(({ className, label, id, type = "checkbox", inline, ...rest }, ref) => (
    <div className={classNames("form-check", inline && "form-check-inline", className)}>
        <input ref={ref} type={type} id={id} className="form-check-input" {...rest} />
        {label && <label htmlFor={id} className="form-check-label">{label}</label>}
    </div>
));

InputCheck.displayName = "Input.Check";

const InputSwitch = React.forwardRef<HTMLInputElement, InputSwitchProps>(({ className, label, id, ...rest }, ref) => (
    <div className={classNames("form-check form-switch", className)}>
        <input ref={ref} type="checkbox" role="switch" id={id} className="form-check-input" {...rest} />
        {label && <label htmlFor={id} className="form-check-label">{label}</label>}
    </div>
));

InputSwitch.displayName = "Input.Switch";

export interface InputSelectProps extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
}

const InputSelect = React.forwardRef<HTMLSelectElement, InputSelectProps>(({ className, children, ...rest }, ref) => (
    <select ref={ref} className={classNames("form-select", className)} {...rest}>
        {children}
    </select>
));

InputSelect.displayName = "Input.Select";

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...rest }, ref) => {
    const innerClass = type === "checkbox" || type === "radio" ? "form-check-input" : "form-control";

    return (
        <ClearableInput ref={ref} type={type} className={classNames(innerClass, className)} {...rest} />
    );
});

InputComponent.displayName = "Input";

export const Input = Object.assign(InputComponent, {
    Check: InputCheck,
    Select: InputSelect,
    Switch: InputSwitch,
});
