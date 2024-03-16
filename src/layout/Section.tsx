import classNames from "classnames";

export const Section: React.FC<React.PropsWithChildren<SectionProps>> = ({ title, titleSize, children, className, ...rest}) => {

    const H: any = `h${titleSize}`;

    return (

        <section className={classNames("section", className)} {...rest}>
            {title && <H>{title}</H>}
            {children}
        </section>
    );
}

Section.defaultProps = {
    titleSize: 2,
};

export interface SectionProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
    title?: string;
    titleSize?: 1 | 2 | 3 | 4 | 5 | 6;
}
