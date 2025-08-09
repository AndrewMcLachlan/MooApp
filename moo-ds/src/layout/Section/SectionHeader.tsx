export type SectionHeaderComponent = React.FC<React.PropsWithChildren<unknown>>;

export const SectionHeader: SectionHeaderComponent = ({ children }) => (
    <div className="header">
        {children}
    </div>
);
