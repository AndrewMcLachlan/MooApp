import { SectionProps } from "../../dist";
import { Form, FormProps } from "../components";
import { PropsWithChildren } from "react";

export const SectionForm = <TFormValues,>({ header, headerSize = 2, children, ...rest }: PropsWithChildren<SectionFormProps<TFormValues>>) => {

    const H: any = `h${headerSize}`;
    const headerNode = typeof header === "string" ? (header = <H>{header}</H>) : header;

    return (
        <Form className="section" {...rest}>
            {headerNode}
            {children}
        </Form>
    );
}

export interface SectionFormProps<TFormValues> extends FormProps<TFormValues>, Pick<SectionProps, "header" | "headerSize"> {
}
