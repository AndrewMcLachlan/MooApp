import classNames from "classnames";
import { SectionSubheading, type SectionSubheadingComponent } from "./SectionSubheading";
import { SectionHeader, type SectionHeaderComponent } from "./SectionHeader";
import { SectionBody, type SectionBodyComponent } from "./SectionBody";
import { useLink } from "../../providers/LinkProvider";

export type SectionComponent = React.FC<React.PropsWithChildren<SectionProps>> & {
    Body: SectionBodyComponent;
    Header: SectionHeaderComponent;
    Subheading: SectionSubheadingComponent;
};

const Section: SectionComponent = ({ header, headerSize = 2, to, accent, children, className, style, ...rest }) => {

    const H: any = `h${headerSize}`;
    const Link = useLink();

    const headerLinkNode = to ? <Link to={to}>{header}</Link> : header;

    const headerNode = typeof header === "string" ? (<H className="section-header">{headerLinkNode}</H>) : headerLinkNode;

    const accentStyle = accent ? { ...style, "--section-accent": accent } as React.CSSProperties : style;

    return (

        <section className={classNames("section", accent && "section-accent", className)} style={accentStyle} {...rest}>
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
    /** A CSS colour for a bar down the section's left edge. */
    accent?: string;
}
