import classNames from "classnames";
import React from "react";

export type SkeletonVariant = "text" | "circle" | "rect";

export interface SkeletonProps extends React.HTMLAttributes<HTMLElement> {
    /** Shape of the placeholder. Defaults to "rect". */
    variant?: SkeletonVariant;
    as?: React.ElementType;
}

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLElement> {
    /** Number of text lines to render. Defaults to 1. */
    lines?: number;
}

export interface SkeletonCircleProps extends React.HTMLAttributes<HTMLElement> {
    /** Diameter preset. Defaults to "md". */
    size?: "sm" | "md" | "lg";
}

export type SkeletonRectProps = React.HTMLAttributes<HTMLElement>;

// A single shimmering placeholder shape. Decorative by default (aria-hidden):
// skeletons render in bulk, so the *loading region* that contains them owns the
// single "busy" announcement (aria-busy), not each individual shape.
const SkeletonRoot = React.forwardRef<HTMLElement, SkeletonProps>(
    ({ variant = "rect", as: Tag = "span", className, ...rest }, ref) => (
        <Tag
            ref={ref}
            className={classNames("skeleton", `skeleton-${variant}`, className)}
            aria-hidden="true"
            {...rest}
        />
    )
);

SkeletonRoot.displayName = "Skeleton";

const SkeletonText: React.FC<SkeletonTextProps> = ({ lines = 1, className, ...rest }) => (
    <span className={classNames("skeleton-text", className)} aria-hidden="true" {...rest}>
        {Array.from({ length: lines }).map((_, index) => (
            <span key={index} className="skeleton skeleton-text-line" />
        ))}
    </span>
);

SkeletonText.displayName = "Skeleton.Text";

const SkeletonCircle: React.FC<SkeletonCircleProps> = ({ size = "md", className, ...rest }) => (
    <span
        className={classNames("skeleton", "skeleton-circle", `skeleton-circle-${size}`, className)}
        aria-hidden="true"
        {...rest}
    />
);

SkeletonCircle.displayName = "Skeleton.Circle";

const SkeletonRect: React.FC<SkeletonRectProps> = ({ className, ...rest }) => (
    <span className={classNames("skeleton", "skeleton-rect", className)} aria-hidden="true" {...rest} />
);

SkeletonRect.displayName = "Skeleton.Rect";

export const Skeleton = Object.assign(SkeletonRoot, {
    Text: SkeletonText,
    Circle: SkeletonCircle,
    Rect: SkeletonRect,
});
