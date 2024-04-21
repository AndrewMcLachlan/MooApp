export type SectionSubheadingComponent = React.FC<React.PropsWithChildren<SectionSubheadingProps>>;

export const SectionSubheading: SectionSubheadingComponent = ({ size, children }) => {
    const H: any = `h${size}`;
    return (
        <H className="subheading">{children}</H>
    );
};

SectionSubheading.defaultProps = {
    size: 3,
};

export interface SectionSubheadingProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
    size?: 1 | 2 | 3 | 4 | 5 | 6;
}
