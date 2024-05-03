import { Form, FormProps } from "../components";
import { PropsWithChildren } from "react";

export const SectionForm = <TFormValues,>({ title, titleSize = 2, children, ...rest }: PropsWithChildren<SectionFormProps<TFormValues>>) => {

    const H: any = `h${titleSize}`;

    return (
        <Form className="section" {...rest}>
            {title && <H>{title}</H>}
            {children}
        </Form>
    );
}

export interface SectionFormProps<TFormValues> extends FormProps<TFormValues> {
    title?: string;
    titleSize?: 1 | 2 | 3 | 4 | 5 | 6;
}
