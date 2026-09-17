import classNames from "classnames";
import React, { useRef, useState, type PropsWithChildren, type ReactNode } from "react";
import { lockAxis, shouldOpen, swipeOffset, type Axis } from "./swipeGestures";

export interface SwipeAction {
    key: string;
    label: string;
    icon?: ReactNode;
    onAction: () => void;
    /** Applied as `swipe-row-action-{variant}`, for a destructive or primary tint. */
    variant?: string;
    disabled?: boolean;
}

export interface SwipeRowProps extends React.HTMLAttributes<HTMLDivElement> {
    actions: SwipeAction[];
}

/**
 * A row whose actions are revealed by swiping it to the left.
 *
 * The actions are real buttons in the document whether or not the row is open,
 * so a keyboard and a screen reader reach them without the gesture; the swipe
 * only moves what covers them.
 */
export const SwipeRow: React.FC<PropsWithChildren<SwipeRowProps>> = ({ actions, className, children, ...rest }) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const startRef = useRef<{ x: number; y: number } | null>(null);
    const axisRef = useRef<Axis>("undecided");
    const [offset, setOffset] = useState(0);
    const [open, setOpen] = useState(false);

    const panelWidth = () => panelRef.current?.offsetWidth ?? 0;

    const close = () => {
        setOpen(false);
        setOffset(0);
    };

    const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (actions.length === 0) return;
        const touch = e.touches[0];
        startRef.current = { x: touch.clientX, y: touch.clientY };
        axisRef.current = "undecided";
    };

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const start = startRef.current;
        if (!start) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - start.x;
        const deltaY = touch.clientY - start.y;

        if (axisRef.current === "undecided") {
            axisRef.current = lockAxis(deltaX, deltaY);
        }
        if (axisRef.current !== "horizontal") return;

        const base = open ? -panelWidth() : 0;
        setOffset(swipeOffset(base + deltaX, panelWidth()));
    };

    const onTouchEnd = () => {
        startRef.current = null;
        if (axisRef.current !== "horizontal") return;

        const width = panelWidth();
        const opening = shouldOpen(offset, width);
        setOpen(opening);
        setOffset(opening ? -width : 0);
    };

    return (
        <div {...rest} className={classNames("swipe-row", open && "open", className)}>
            <div className="swipe-row-actions" ref={panelRef}>
                {actions.map((action) => (
                    <button
                        key={action.key}
                        type="button"
                        className={classNames("swipe-row-action", action.variant && `swipe-row-action-${action.variant}`)}
                        disabled={action.disabled}
                        onClick={() => {
                            close();
                            action.onAction();
                        }}
                    >
                        {action.icon}
                        <span>{action.label}</span>
                    </button>
                ))}
            </div>
            <div
                className="swipe-row-content"
                style={{ transform: offset !== 0 ? `translateX(${offset}px)` : undefined }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onTouchCancel={close}
            >
                {children}
            </div>
        </div>
    );
};

SwipeRow.displayName = "SwipeRow";
