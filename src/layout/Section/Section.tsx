import classNames from "classnames";
import { SectionSubheading, SectionSubheadingComponent } from "./SectionSubheading";
import { SectionHeader, SectionHeaderComponent } from "./SectionHeader";
import { SectionBody, SectionBodyComponent } from "./SectionBody";

export type SectionComponent = React.FC<React.PropsWithChildren<SectionProps>> & {
    Body: SectionBodyComponent;
    Header: SectionHeaderComponent;
    Subheading: SectionSubheadingComponent;
};

const Section: SectionComponent = ({ title, titleSize, children, className, ...rest }) => {

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

Section.Body = SectionBody;
Section.Header = SectionHeader;
Section.Subheading = SectionSubheading;

export { Section };

export interface SectionProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
    title?: string;
    titleSize?: 1 | 2 | 3 | 4 | 5 | 6;
}
