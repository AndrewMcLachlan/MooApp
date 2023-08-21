import classNames from "classnames";

export const Section: React.FC<React.PropsWithChildren<SectionProps>> = ({ title, size, children, className, ...rest}) => {

    const H: any = `h${size}`;

    return (

        <section className={classNames("section", className)} {...rest}>
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