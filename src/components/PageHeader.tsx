import { PropsWithChildren } from "react";

export const PageHeader: React.FC<PropsWithChildren<PageHeaderProps>> = ({ children, ...props }) => (
    <header>
        <div className="container"><h2>{props.title}</h2>
        {
            children && 
            <div className="buttons">
                {children}
            </div>
        }
        </div>
    </header>
);

export interface PageHeaderProps {
    title?: string;
}