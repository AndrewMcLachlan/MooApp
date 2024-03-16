import { Form, FormProps } from "components/form/Form";
import { PropsWithChildren } from "react";

export const SectionForm = <TFormValues,>({ title, titleSize, children, ...rest }: PropsWithChildren<SectionFormProps<TFormValues>>) => {

    const H: any = `h${titleSize}`;

    return (
        <Form className="section" {...rest}>
            {title && <H>{title}</H>}
            {children}
        </Form>
    );
}

SectionForm.defaultProps = {
    titleSize: 2,
};

export interface SectionFormProps<TFormValues> extends FormProps<TFormValues> {
    title?: string;
    titleSize?: 1 | 2 | 3 | 4 | 5 | 6;
}
