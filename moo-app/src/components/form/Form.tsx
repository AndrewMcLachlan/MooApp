import React, { PropsWithChildren } from "react";
import { FormProvider, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
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

export const Form: FormComponent<any> = <TFormValues,>({ onSubmit, children, className, form, ...rest }: PropsWithChildren<FormProps<TFormValues>>) => {

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={className ?? "form-container"} {...rest}>
                {children}
            </form>
        </FormProvider>
    );
}

Form.Group = Group;
Form.Input = Input;
Form.Label = Label;
Form.Password = Password;
Form.Select = Select;
Form.TextArea = TextArea;

Form.displayName = "Form";

export interface FormProps<TFormValues> extends Omit<React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, "onSubmit"> {
    onSubmit: SubmitHandler<TFormValues>;
    form: UseFormReturn<TFormValues>;
}
