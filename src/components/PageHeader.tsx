export const PageHeader = (props: PageHeaderProps) => (
    <header>
        <h2 className="container">{props.title}</h2>
    </header>
);

export interface PageHeaderProps {
    title?: string;
}