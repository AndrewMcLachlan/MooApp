import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropsWithChildren, useCallback, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const Tooltip: React.FC<PropsWithChildren<{ id: string }>> = ({ id, children }) => {
    const uniqueId = useId();
    const tooltipId = `tooltip-${id || uniqueId}`;
    const triggerRef = useRef<HTMLSpanElement>(null);
    const [show, setShow] = useState(false);
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    const updatePosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX + rect.width / 2,
        });
    }, []);

    const handleShow = useCallback(() => {
        updatePosition();
        setShow(true);
    }, [updatePosition]);

    const handleHide = useCallback(() => {
        setShow(false);
    }, []);

    return (
        <>
            <span
                ref={triggerRef}
                className="tooltip-wrapper"
                tabIndex={0}
                onMouseEnter={handleShow}
                onMouseLeave={handleHide}
                onFocus={handleShow}
                onBlur={handleHide}
            >
                <span className="tooltip-icon" aria-describedby={tooltipId}>
                    <FontAwesomeIcon icon="info-circle" size="1x" />
                </span>
            </span>
            {show && createPortal(
                <span
                    className="tooltip-content tooltip-portal"
                    id={tooltipId}
                    data-placement="top"
                    role="tooltip"
                    style={{ top: `${position.top}px`, left: `${position.left}px` }}
                >
                    {children}
                </span>,
                document.body
            )}
        </>
    );
};

Tooltip.displayName = "Tooltip";
