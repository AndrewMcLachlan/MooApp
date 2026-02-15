import classNames from "classnames";
import React from "react";

export interface ColProps extends React.HTMLAttributes<HTMLElement> {
    as?: React.ElementType;
    xs?: number | boolean;
    sm?: number | boolean;
    md?: number | boolean;
    lg?: number | boolean;
    xl?: number | boolean;
    xxl?: number | boolean;
}

function colClass(breakpoint: string, value: number | boolean | undefined): string | undefined {
    if (value === undefined) return undefined;
    if (value === true) return breakpoint ? `col-${breakpoint}` : "col";
    return breakpoint ? `col-${breakpoint}-${value}` : `col-${value}`;
}

export const Col = React.forwardRef<HTMLElement, React.PropsWithChildren<ColProps>>(
    ({ as: Tag = "div", xs, sm, md, lg, xl, xxl, className, children, ...rest }, ref) => {
        const classes = classNames(
            colClass("", xs),
            colClass("sm", sm),
            colClass("md", md),
            colClass("lg", lg),
            colClass("xl", xl),
            colClass("xxl", xxl),
            // Default to col if no breakpoint specified
            !xs && !sm && !md && !lg && !xl && !xxl && "col",
            className,
        );

        return (
            <Tag ref={ref} className={classes} {...rest}>
                {children}
            </Tag>
        );
    }
);

Col.displayName = "Col";
