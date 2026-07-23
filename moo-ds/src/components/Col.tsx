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
    /** ≥1880px — 1920 (Full HD) class displays. */
    fhd?: number | boolean;
    /** ≥2520px — 2560 (Quad HD) class displays. */
    qhd?: number | boolean;
    /** ≥3200px — ultrawide/4K class displays. */
    uhd?: number | boolean;
}

function colClass(breakpoint: string, value: number | boolean | undefined): string | undefined {
    if (value === undefined) return undefined;
    if (value === true) return breakpoint ? `col-${breakpoint}` : "col";
    return breakpoint ? `col-${breakpoint}-${value}` : `col-${value}`;
}

export const Col = React.forwardRef<HTMLElement, React.PropsWithChildren<ColProps>>(
    ({ as: Tag = "div", xs, sm, md, lg, xl, xxl, fhd, qhd, uhd, className, children, ...rest }, ref) => {
        const classes = classNames(
            colClass("", xs),
            colClass("sm", sm),
            colClass("md", md),
            colClass("lg", lg),
            colClass("xl", xl),
            colClass("xxl", xxl),
            colClass("fhd", fhd),
            colClass("qhd", qhd),
            colClass("uhd", uhd),
            // Default to col if no breakpoint specified
            !xs && !sm && !md && !lg && !xl && !xxl && !fhd && !qhd && !uhd && "col",
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
