import { Form, FormProps } from "components/form/Form";

export const SectionForm = <TFormValues,>({ title, titleSize, children, ...rest }: SectionFormProps<TFormValues>) => {

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
