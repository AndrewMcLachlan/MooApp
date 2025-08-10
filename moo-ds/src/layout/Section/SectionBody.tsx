export type SectionBodyComponent = React.FC<React.PropsWithChildren<unknown>>;

export const SectionBody: SectionBodyComponent = ({ children }) => (
    <div className="body">
        {children}
    </div>
);
