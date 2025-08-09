import classNames from "classnames";
import { SectionSubheading, SectionSubheadingComponent } from "./SectionSubheading";
import { SectionHeader, SectionHeaderComponent } from "./SectionHeader";
import { SectionBody, SectionBodyComponent } from "./SectionBody";
import { useLink } from "../../providers/LinkProvider";

export type SectionComponent = React.FC<React.PropsWithChildren<SectionProps>> & {
    Body: SectionBodyComponent;
    Header: SectionHeaderComponent;
    Subheading: SectionSubheadingComponent;
};

const Section: SectionComponent = ({ header, headerSize = 2, to, children, className, ...rest }) => {

    const H: any = `h${headerSize}`;
    const Link = useLink();

    const headerLinkNode = to ? <Link to={to}>{header}</Link> : header;

    const headerNode = typeof header === "string" ? (<H className="section-header">{headerLinkNode}</H>) : headerLinkNode;



    return (

        <section className={classNames("section", className)} {...rest}>
            {headerNode}
            {children}
        </section>
    );
}

Section.Body = SectionBody;
Section.Header = SectionHeader;
Section.Subheading = SectionSubheading;

export { Section };

export interface SectionProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
    header?: string | React.ReactNode;
    headerSize?: 1 | 2 | 3 | 4 | 5 | 6;
    to?: string;
}
