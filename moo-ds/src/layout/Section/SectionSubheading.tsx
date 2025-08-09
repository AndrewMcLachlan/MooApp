export type SectionSubheadingComponent = React.FC<React.PropsWithChildren<SectionSubheadingProps>>;

export const SectionSubheading: SectionSubheadingComponent = ({ size = 3, children }) => {
    const H: any = `h${size}`;
    return (
        <H className="subheading">{children}</H>
    );
};

export interface SectionSubheadingProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
    size?: 1 | 2 | 3 | 4 | 5 | 6;
}
