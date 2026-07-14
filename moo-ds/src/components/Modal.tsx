import classNames from "classnames";
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
    show: boolean;
    onHide?: () => void;
    size?: "sm" | "lg" | "xl";
}

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    closeButton?: boolean;
    onHide?: () => void;
}

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
}

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
}

export interface ModalTitleProps extends React.HTMLAttributes<HTMLElement> {
    as?: React.ElementType;
}

const sizeWidths: Record<string, string> = {
    sm: "300px",
    lg: "800px",
    xl: "1140px",
};

const ModalHeader: React.FC<React.PropsWithChildren<ModalHeaderProps>> = ({ closeButton, onHide, className, children, ...rest }) => (
    <div className={classNames("modal-header", className)} {...rest}>
        {children}
        {closeButton && <button type="button" className="btn-close" aria-label="Close" onClick={onHide} />}
    </div>
);

ModalHeader.displayName = "Modal.Header";

const ModalBody: React.FC<React.PropsWithChildren<ModalBodyProps>> = ({ className, children, ...rest }) => (
    <div className={classNames("modal-body", className)} {...rest}>
        {children}
    </div>
);

ModalBody.displayName = "Modal.Body";

const ModalFooter: React.FC<React.PropsWithChildren<ModalFooterProps>> = ({ className, children, ...rest }) => (
    <div className={classNames("modal-footer", className)} {...rest}>
        {children}
    </div>
);

ModalFooter.displayName = "Modal.Footer";

const ModalTitle: React.FC<React.PropsWithChildren<ModalTitleProps>> = ({ as: Component = "h4", className, children, ...rest }) => (
    <Component className={classNames("modal-title", className)} {...rest}>
        {children}
    </Component>
);

ModalTitle.displayName = "Modal.Title";

const ModalComponent: React.FC<React.PropsWithChildren<ModalProps>> = ({ show, onHide, size, className, children, style, ...rest }) => {

    const contentRef = useRef<HTMLDivElement>(null);
    const previouslyFocused = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [show]);

    // Move focus into the dialog on open and restore it to the previously
    // focused element on close.
    useEffect(() => {
        if (!show) return undefined;

        previouslyFocused.current = document.activeElement as HTMLElement | null;
        const focusables = contentRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        (focusables && focusables.length ? focusables[0] : contentRef.current)?.focus();

        return () => {
            previouslyFocused.current?.focus?.();
        };
    }, [show]);

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!show) return;

        if (e.key === "Escape") {
            e.stopPropagation();
            onHide?.();
            return;
        }

        if (e.key === "Tab") {
            const focusables = contentRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
            if (!focusables || focusables.length === 0) {
                e.preventDefault();
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    };

    // Inject onHide into Header children
    const enhancedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child) && (child.type as any)?.displayName === "Modal.Header") {
            return React.cloneElement(child as React.ReactElement<ModalHeaderProps>, { onHide });
        }
        return child;
    });

    const modalStyle = size ? { ...style, "--modal-width": sizeWidths[size] } as React.CSSProperties : style;

    return (
        <>
            {createPortal(
                <div
                    className={classNames("modal", show && "show", className)}
                    tabIndex={-1}
                    style={modalStyle}
                    onKeyDown={onKeyDown}
                    {...rest}
                >
                    <div className="modal-dialog" role="dialog" aria-modal="true">
                        <div className="modal-content" ref={contentRef} tabIndex={-1}>
                            {enhancedChildren}
                        </div>
                    </div>
                </div>,
                document.body
            )}
            {show && createPortal(
                <div className="modal-backdrop show" onClick={onHide} />,
                document.body
            )}
        </>
    );
};

ModalComponent.displayName = "Modal";

export const Modal = Object.assign(ModalComponent, {
    Header: ModalHeader,
    Body: ModalBody,
    Footer: ModalFooter,
    Title: ModalTitle,
});
