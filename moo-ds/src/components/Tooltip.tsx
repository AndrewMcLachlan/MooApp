import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type PropsWithChildren, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const Tooltip: React.FC<PropsWithChildren<{ id: string }>> = ({ id, children }) => {
    const uniqueId = useId();
    const sanitizedId = (id || uniqueId).replace(/:/g, "");
    const tooltipId = `tooltip-${sanitizedId}`;
    const anchorName = `--tooltip-${sanitizedId}`;
    const triggerRef = useRef<HTMLSpanElement>(null);
    const portalRef = useRef<HTMLSpanElement>(null);
    const [show, setShow] = useState(false);

    useLayoutEffect(() => {
        triggerRef.current?.style.setProperty("anchor-name", anchorName);
    }, [anchorName]);

    useLayoutEffect(() => {
        if (show && portalRef.current && triggerRef.current) {
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
                    <FontAwesomeIcon icon="info-circle" size="1x" />
                </span>
            </span>
            {show && createPortal(
                <span
                    ref={portalRef}
                    className="tooltip-content tooltip-portal"
                    id={tooltipId}
                    role="tooltip"
                >
                    {children}
                </span>,
                document.body
            )}
        </>
    );
};

Tooltip.displayName = "Tooltip";
