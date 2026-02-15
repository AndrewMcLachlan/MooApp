import classNames from "classnames";
import React, { MouseEventHandler } from "react";

export interface PaginationBaseProps extends React.HTMLAttributes<HTMLUListElement> {
}

export interface PageItemProps extends Omit<React.HTMLAttributes<HTMLLIElement>, "onClick"> {
    active?: boolean;
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

const PageItem: React.FC<React.PropsWithChildren<PageItemProps>> = ({ active, disabled, className, children, onClick, title, ...rest }) => (
    <li className={classNames("page-item", active && "active", disabled && "disabled", className)} {...rest}>
        <button type="button" className="page-link" onClick={onClick} title={title} aria-disabled={disabled || undefined}>{children}</button>
    </li>
);

PageItem.displayName = "PageItem";

const First: React.FC<PageItemProps> = ({ children, ...rest }) => (
    <PageItem {...rest}>{children || <span aria-hidden="true">&laquo;</span>}</PageItem>
);
First.displayName = "Pagination.First";

const Prev: React.FC<PageItemProps> = ({ children, ...rest }) => (
    <PageItem {...rest}>{children || <span aria-hidden="true">&lsaquo;</span>}</PageItem>
);
Prev.displayName = "Pagination.Prev";

const Next: React.FC<PageItemProps> = ({ children, ...rest }) => (
    <PageItem {...rest}>{children || <span aria-hidden="true">&rsaquo;</span>}</PageItem>
);
Next.displayName = "Pagination.Next";

const Last: React.FC<PageItemProps> = ({ children, ...rest }) => (
    <PageItem {...rest}>{children || <span aria-hidden="true">&raquo;</span>}</PageItem>
);
Last.displayName = "Pagination.Last";

const PaginationComponent = React.forwardRef<HTMLUListElement, React.PropsWithChildren<PaginationBaseProps>>(
    ({ className, children, ...rest }, ref) => (
        <ul ref={ref} className={classNames("pagination", className)} {...rest}>
            {children}
        </ul>
    )
);

PaginationComponent.displayName = "Pagination";

export const PaginationBase = Object.assign(PaginationComponent, {
    First,
    Prev,
    Item: PageItem,
    Next,
    Last,
});
