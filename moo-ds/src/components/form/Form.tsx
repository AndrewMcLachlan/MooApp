import classNames from "classnames";
import React, { PropsWithChildren } from "react";
import { FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";

import { Check, CheckComponent } from "./Check";
import { Group, GroupComponent } from "./Group";
import { Input, InputComponent } from "./Input";
import { Label, LabelComponent } from "./Label";
import { Password, PasswordComponent } from "./Password";
import { Select, SelectComponent } from "./Select";
import { TextArea, TextAreaComponent } from "./TextArea";

export type FormComponent<TFormValues> = React.FC<PropsWithChildren<FormProps<TFormValues>>> & {
    Check: CheckComponent;
    Input: InputComponent;
    Select: SelectComponent;
    Group: GroupComponent;
    Label: LabelComponent
    Password: PasswordComponent;
    TextArea: TextAreaComponent;
};

export const Form: FormComponent<any> = <TFormValues,>({ onSubmit, children, className, form, layout = "vertical", ...rest }: PropsWithChildren<FormProps<TFormValues>>) => {

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={classNames(className ?? "form-container", `form-${layout}` )} {...rest}>
                {children}
            </form>
        </FormProvider>
    );
}

Form.Check = Check;
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
    layout?: "horizontal" | "vertical";
}
