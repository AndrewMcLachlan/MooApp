import React, { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

export interface OverlayTriggerProps {
    trigger?: "click" | "hover" | "focus" | ("click" | "hover" | "focus")[];
    placement?: "top" | "bottom" | "left" | "right";
    overlay: React.ReactElement;
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
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const triggers = Array.isArray(trigger) ? trigger : [trigger];

    const updatePosition = useCallback(() => {
        if (!triggerRef.current || !overlayRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const overlayRect = overlayRef.current.getBoundingClientRect();
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        let top = 0;
        let left = 0;

        switch (placement) {
            case "bottom":
                top = triggerRect.bottom + scrollY + containerPadding;
                left = triggerRect.left + scrollX + (triggerRect.width / 2) - (overlayRect.width / 2);
                break;
            case "top":
                top = triggerRect.top + scrollY - overlayRect.height - containerPadding;
                left = triggerRect.left + scrollX + (triggerRect.width / 2) - (overlayRect.width / 2);
                break;
            case "left":
                top = triggerRect.top + scrollY + (triggerRect.height / 2) - (overlayRect.height / 2);
                left = triggerRect.left + scrollX - overlayRect.width - containerPadding;
                break;
            case "right":
                top = triggerRect.top + scrollY + (triggerRect.height / 2) - (overlayRect.height / 2);
                left = triggerRect.right + scrollX + containerPadding;
                break;
        }

        // Clamp to viewport
        left = Math.max(containerPadding, Math.min(left, window.innerWidth - overlayRect.width - containerPadding));

        setPosition({ top, left });
    }, [placement, containerPadding]);

    useEffect(() => {
        if (show) {
            // Defer position calculation to next frame so the overlay is rendered
            requestAnimationFrame(updatePosition);
        }
    }, [show, updatePosition]);

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
                    style={{
                        position: "absolute",
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                        zIndex: 1070,
                    }}
                >
                    {overlay}
                </div>,
                document.body
            )}
        </>
    );
};

OverlayTrigger.displayName = "OverlayTrigger";
