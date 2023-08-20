import { ReactElement, createElement } from "react";


export const Section: React.FC<React.PropsWithChildren<SectionProps>> = ({ title, size, children, ...rest}) => {

    const H: any = `h${size}`;

    return (

        <section {...rest}>
            {title && <H>{title}</H>}
            {children}
        </section>
    );
}

Section.defaultProps = {
    size: 2,
};

export interface SectionProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
    title?: string;
    size?: 1 | 2 | 3 | 4 | 5 | 6;
}