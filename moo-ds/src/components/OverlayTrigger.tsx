import React, { useRef, useState, useEffect, useId, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

export interface OverlayTriggerProps {
    trigger?: "click" | "hover" | "focus" | ("click" | "hover" | "focus")[];
    placement?: "top" | "bottom" | "left" | "right";
    overlay: React.ReactElement | ((close: () => void) => React.ReactElement);
    rootClose?: boolean;
    containerPadding?: number;
    children: React.ReactElement;
}

const placementToPositionArea: Record<string, string> = {
    top: "top",
    bottom: "bottom",
    left: "left",
    right: "right",
};

const placementToFlip: Record<string, string> = {
    top: "flip-block",
    bottom: "flip-block",
    left: "flip-inline",
    right: "flip-inline",
};

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

    useLayoutEffect(() => {
        triggerRef.current?.style.setProperty("anchor-name", anchorName);
    }, [anchorName]);

    useLayoutEffect(() => {
        if (show && overlayRef.current) {
            overlayRef.current.style.setProperty("position-anchor", anchorName);
            overlayRef.current.style.setProperty("position-area", placementToPositionArea[placement]);
            overlayRef.current.style.setProperty("position-try-fallbacks", placementToFlip[placement]);
            if (containerPadding > 0) {
                overlayRef.current.style.setProperty("--overlay-padding", `${containerPadding}px`);
            }
        }
    }, [show, anchorName, placement, containerPadding]);

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
                    className="overlay-portal"
                >
                    {typeof overlay === "function" ? overlay(() => setShow(false)) : overlay}
                </div>,
                document.body
            )}
        </>
    );
};

OverlayTrigger.displayName = "OverlayTrigger";
