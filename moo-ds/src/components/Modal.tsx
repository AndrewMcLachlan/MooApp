import classNames from "classnames";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

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

    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [show]);

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
                    {...rest}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
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
