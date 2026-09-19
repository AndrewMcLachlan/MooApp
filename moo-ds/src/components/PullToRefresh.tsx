import classNames from "classnames";
import React, { useRef, useState, type PropsWithChildren } from "react";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { canPull, isArmed, isVertical, pullDistance, PULL_THRESHOLD, scrollTopOf } from "./pullGestures";

export interface PullToRefreshProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Awaited, so the spinner runs until the data is actually back. */
    onRefresh: () => Promise<unknown> | void;
    disabled?: boolean;
    /** Accessible name for the indicator while refreshing. */
    refreshingLabel?: string;
}

/**
 * Scroll container that refreshes when pulled down from the top.
 *
 * The gesture is touch only: a mouse has a scrollbar and a keyboard has the
 * page's own controls, and binding it to either makes the content jump under
 * an ordinary drag.
 */
export const PullToRefresh: React.FC<PropsWithChildren<PullToRefreshProps>> = ({
    onRefresh, disabled = false, refreshingLabel = "Refreshing", className, children, ...rest
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const startRef = useRef<{ x: number; y: number } | null>(null);
    const [distance, setDistance] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const reset = () => {
        startRef.current = null;
        setDistance(0);
    };

    const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (disabled || refreshing) return;
        if (!canPull(scrollTopOf(containerRef.current))) return;
        const touch = e.touches[0];
        startRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const start = startRef.current;
        if (!start) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - start.x;
        const deltaY = touch.clientY - start.y;

        if (!isVertical(deltaX, deltaY)) {
            reset();
            return;
        }

        setDistance(pullDistance(deltaY));
    };

    const onTouchEnd = async () => {
        const pulled = distance;
        reset();
        if (!isArmed(pulled) || refreshing) return;

        setRefreshing(true);
        try {
            await onRefresh();
        } catch {
            // Swallowed deliberately: this runs from a touch handler, so a
            // rejection escaping here is an unhandled rejection in the host
            // app. Reporting the failure belongs to whoever owns onRefresh.
        } finally {
            setRefreshing(false);
        }
    };

    const offset = refreshing ? PULL_THRESHOLD * 0.5 : distance;

    return (
        <div
            {...rest}
            ref={containerRef}
            className={classNames("pull-to-refresh", className)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={reset}
        >
            <div
                className={classNames("pull-to-refresh-indicator", (refreshing || isArmed(distance)) && "armed")}
                style={{ height: offset }}
                aria-hidden={!refreshing}
                aria-label={refreshing ? refreshingLabel : undefined}
                role={refreshing ? "status" : undefined}
            >
                {offset > 0 && <FontAwesomeIcon icon={faArrowsRotate} spin={refreshing} />}
            </div>
            <div
                className="pull-to-refresh-content"
                style={{ transform: offset > 0 ? `translateY(${offset}px)` : undefined }}
            >
                {children}
            </div>
        </div>
    );
};

PullToRefresh.displayName = "PullToRefresh";
