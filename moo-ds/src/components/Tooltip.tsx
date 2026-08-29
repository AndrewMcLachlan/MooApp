import { type PropsWithChildren, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { showInTopLayer, topLayerProps } from "../utils/topLayer";
import { Icon } from "./Icon";
import { Information } from "@andrewmclachlan/moo-icons";

export const Tooltip: React.FC<PropsWithChildren<{ id: string }>> = ({ id, children }) => {
    const uniqueId = useId();
    const sanitizedId = (id || uniqueId).replace(/:/g, "");
    const tooltipId = `tooltip-${sanitizedId}`;
    const anchorName = `--tooltip-${sanitizedId}`;
    const triggerRef = useRef<HTMLSpanElement>(null);
    const portalRef = useRef<HTMLSpanElement>(null);
    const [show, setShow] = useState(false);

    // Must be setProperty: a strict CSP blocks style attributes but exempts the
    // style property, so setAttribute/cssText would stop working for consumers.
    useLayoutEffect(() => {
        triggerRef.current?.style.setProperty("anchor-name", anchorName);
    }, [anchorName]);

    useLayoutEffect(() => {
        if (show && portalRef.current && triggerRef.current) {
            // Promote into the top layer. The tooltip previously relied on
            // z-index: 1080, which loses to anything on the page carrying a
            // higher one -- a third-party widget, an app-level overlay --
            // and loses outright to a top-layer dialog, which paints above
            // any z-index at all. Guarded, so an environment without the
            // popover API (jsdom) just renders it in place as before.
            showInTopLayer(portalRef.current);

            portalRef.current.style.setProperty("position-anchor", anchorName);
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const portalRect = portalRef.current.getBoundingClientRect();
            const arrowLeft = triggerRect.left + triggerRect.width / 2 - portalRect.left;
            portalRef.current.style.setProperty("--arrow-left", `${arrowLeft}px`);
        }
    }, [show, anchorName]);

    return (
        <>
            <span
                ref={triggerRef}
                className="tooltip-wrapper"
                tabIndex={0}
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                onFocus={() => setShow(true)}
                onBlur={() => setShow(false)}
            >
                <span className="tooltip-icon" aria-describedby={tooltipId}>
                    <Icon icon={Information} size="sm" className="muted" />
                </span>
            </span>
            {show && createPortal(
                <span
                    ref={portalRef}
                    className="tooltip-content tooltip-portal"
                    id={tooltipId}
                    role="tooltip"
                    {...topLayerProps()}
                >
                    {children}
                </span>,
                document.body
            )}
        </>
    );
};

Tooltip.displayName = "Tooltip";
