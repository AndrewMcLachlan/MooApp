import React, { useRef, useState, useEffect, useId, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { showInTopLayer, topLayerProps } from "../utils/topLayer";

export interface OverlayTriggerProps {
    trigger?: "click" | "hover" | "focus" | ("click" | "hover" | "focus")[];
    placement?: "top" | "bottom" | "left" | "right";
    overlay: React.ReactElement | ((close: () => void) => React.ReactElement);
    rootClose?: boolean;
    containerPadding?: number;
    children: React.ReactElement;
}

export const OverlayTrigger: React.FC<OverlayTriggerProps> = ({
    trigger = "click",
    placement = "bottom",
    overlay,
    rootClose = false,
    containerPadding = 0,
    children,
}) => {
    const [show, setShow] = useState(false);
    const triggerRef = useRef<HTMLElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const uniqueId = useId();
    const sanitizedId = uniqueId.replace(/:/g, "");
    const anchorName = `--overlay-${sanitizedId}`;

    const triggers = Array.isArray(trigger) ? trigger : [trigger];

    // setProperty, never setAttribute("style") or style.cssText: a CSP without
    // 'unsafe-inline' blocks those two but explicitly exempts styles set on the
    // element's style property, so this keeps working for a consumer that sets one.
    // The anchor name cannot be a class -- it is generated per instance, and the
    // overlay is portalled, so tree order cannot pair it with its trigger.
    useLayoutEffect(() => {
        triggerRef.current?.style.setProperty("anchor-name", anchorName);
    }, [anchorName]);

    // position-anchor has to be set here because the anchor name is generated
    // per trigger instance. position-area and the flip fallbacks are driven by
    // the .overlay-<placement> class instead, so the placement mapping lives in
    // _overlay.css rather than in inline styles.
    useLayoutEffect(() => {
        if (show && overlayRef.current) {
            // Promote into the top layer -- see the note in Tooltip.tsx. The
            // z-index: 1070 this replaces loses to any higher z-index on the
            // page, and to a top-layer dialog outright. Guarded, so jsdom --
            // which has no popover API -- keeps rendering the overlay in
            // place.
            showInTopLayer(overlayRef.current);

            overlayRef.current.style.setProperty("position-anchor", anchorName);
            if (containerPadding > 0) {
                overlayRef.current.style.setProperty("--overlay-padding", `${containerPadding}px`);
            }
        }
    }, [show, anchorName, containerPadding]);

    useEffect(() => {
        if (!show || !rootClose) return () => {};

        const handleClickOutside = (e: MouseEvent) => {
            if (
                triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
                overlayRef.current && !overlayRef.current.contains(e.target as Node)
            ) {
                setShow(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [show, rootClose]);

    const triggerProps: Record<string, any> = {
        ref: triggerRef,
    };

    if (triggers.includes("click")) {
        triggerProps.onClick = (e: React.MouseEvent) => {
            setShow(!show);
            // Call original onClick if it exists
            if ((children.props as any)?.onClick) {
                (children.props as any).onClick(e);
            }
        };
    }

    if (triggers.includes("hover")) {
        triggerProps.onMouseEnter = () => setShow(true);
        triggerProps.onMouseLeave = () => setShow(false);
    }

    if (triggers.includes("focus")) {
        triggerProps.onFocus = () => setShow(true);
        triggerProps.onBlur = () => setShow(false);
    }

    return (
        <>
            {React.cloneElement(children, triggerProps)}
            {show && createPortal(
                <div
                    ref={overlayRef}
                    className={`overlay-portal overlay-${placement}`}
                    {...topLayerProps()}
                >
                    {typeof overlay === "function" ? overlay(() => setShow(false)) : overlay}
                </div>,
                document.body
            )}
        </>
    );
};

OverlayTrigger.displayName = "OverlayTrigger";
