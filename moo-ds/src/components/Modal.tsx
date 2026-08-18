import classNames from "classnames";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { hideFromTopLayer, showInTopLayer, topLayerProps } from "../utils/topLayer";

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

const ModalComponent: React.FC<React.PropsWithChildren<ModalProps>> = ({
    show,
    onHide,
    size,
    className,
    children,
    style,
    onKeyDown: consumerOnKeyDown,
    onClick: consumerOnClick,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    ...rest
}) => {

    const contentRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const previouslyFocused = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [show]);

    // Put the modal and its backdrop in the top layer, so neither can be
    // covered by page content however high its z-index. The backdrop goes
    // first: the top layer stacks in the order elements are promoted, so
    // promoting it before the modal keeps the dimming behind the dialog.
    //
    // popover rather than dialog.showModal(): showModal() makes everything
    // outside the dialog inert, and a tooltip or popover is portalled to the
    // body rather than into the modal, so it would be painted above the modal
    // but refuse clicks. A popover leaves the rest of the page interactive, so
    // those keep working -- and the focus trap this component already
    // implements stays in charge rather than being replaced by native
    // behaviour no test here could reach.
    useLayoutEffect(() => {
        if (!show) return undefined;

        showInTopLayer(backdropRef.current);
        showInTopLayer(modalRef.current);

        return () => {
            hideFromTopLayer(modalRef.current);
            hideFromTopLayer(backdropRef.current);
        };
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
        // Run the consumer's handler first; if it handles the event
        // (preventDefault), don't also apply the a11y key handling.
        consumerOnKeyDown?.(e);
        if (e.defaultPrevented) return;

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

    // Dismiss when the click lands on the modal itself rather than inside the
    // dialog. .modal covers the whole viewport and sits above .modal-backdrop,
    // so a click on the dimmed area reaches this element and never reaches the
    // backdrop -- the backdrop's own handler only fires for a synthesised
    // click, which is why the tests did not catch it.
    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        consumerOnClick?.(e);
        if (e.defaultPrevented) return;
        if (e.target === e.currentTarget) onHide?.();
    };

    // Inject onHide into Header children
    const enhancedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child) && (child.type as any)?.displayName === "Modal.Header") {
            return React.cloneElement(child as React.ReactElement<ModalHeaderProps>, { onHide });
        }
        return child;
    });

    return (
        <>
            {createPortal(
                <div
                    ref={modalRef}
                    className={classNames("modal", size && `modal-${size}`, show && "show", className)}
                    tabIndex={-1}
                    style={style}
                    onKeyDown={onKeyDown}
                    onClick={onClick}
                    {...rest}
                    // Last, so a consumer cannot unset it: the popover
                    // attribute is what puts the modal in the top layer, and
                    // dropping it would silently return the modal to competing
                    // on z-index.
                    {...topLayerProps()}
                >
                    <div className="modal-dialog" role="dialog" aria-modal="true" aria-label={ariaLabel} aria-labelledby={ariaLabelledby} aria-describedby={ariaDescribedby}>
                        <div className="modal-content" ref={contentRef} tabIndex={-1}>
                            {enhancedChildren}
                        </div>
                    </div>
                </div>,
                document.body
            )}
            {show && createPortal(
                <div ref={backdropRef} className="modal-backdrop show" onClick={onHide} {...topLayerProps()} />,
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
