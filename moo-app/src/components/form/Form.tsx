import React, { PropsWithChildren } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Group, GroupComponent } from "./Group";
import { Input, InputComponent } from "./Input";
import { Label, LabelComponent } from "./Label";
import { Select, SelectComponent } from "./Select";
import { TextArea, TextAreaComponent } from "./TextArea";
import { Password, PasswordComponent } from "./Password";

export type FormComponent<TFormValues> = React.FC<PropsWithChildren<FormProps<TFormValues>>> & {
    Input: InputComponent;
    Select: SelectComponent;
    Group: GroupComponent;
    Label: LabelComponent
    Password: PasswordComponent;
    TextArea: TextAreaComponent;
};

export const Form: FormComponent<any> = <TFormValues,>({onSubmit, children, ...rest}: PropsWithChildren<FormProps<TFormValues>>) => {

    const forms = useForm<TFormValues>();

    return (
        <form onSubmit={forms.handleSubmit(onSubmit)} {...rest}>
            {children}
        </form>
    );
}

Form.Group = Group;
Form.Input = Input;
Form.Label = Label;
Form.Password = Password;
Form.Select = Select;
Form.TextArea = TextArea;

export interface FormProps<TFormValues> extends Omit<React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, "onSubmit"> {
    onSubmit: SubmitHandler<TFormValues>;
}
