import classNames from "classnames";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
    show: boolean;
    onHide?: () => void;
    placement?: "start" | "end";
}

export interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    closeButton?: boolean;
    onHide?: () => void;
}

export interface DrawerBodyProps extends React.HTMLAttributes<HTMLDivElement> {
}

const DrawerHeader: React.FC<React.PropsWithChildren<DrawerHeaderProps>> = ({ closeButton, onHide, className, children, ...rest }) => (
    <div className={classNames("offcanvas-header", className)} {...rest}>
        {children}
        {closeButton && <button type="button" className="btn-close" aria-label="Close" onClick={onHide} />}
    </div>
);

DrawerHeader.displayName = "Drawer.Header";

const DrawerBody: React.FC<React.PropsWithChildren<DrawerBodyProps>> = ({ className, children, ...rest }) => (
    <div className={classNames("offcanvas-body", className)} {...rest}>
        {children}
    </div>
);

DrawerBody.displayName = "Drawer.Body";

const DrawerComponent: React.FC<React.PropsWithChildren<DrawerProps>> = ({ show, onHide, placement = "start", className, children, ...rest }) => {

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
        if (React.isValidElement(child) && (child.type as any)?.displayName === "Drawer.Header") {
            return React.cloneElement(child as React.ReactElement<DrawerHeaderProps>, { onHide });
        }
        return child;
    });

    return (
        <>
            <div
                className={classNames("offcanvas", `offcanvas-${placement}`, show && "show", className)}
                tabIndex={-1}
                {...rest}
            >
                {enhancedChildren}
            </div>
            {show && createPortal(
                <div className="offcanvas-backdrop show" onClick={onHide} />,
                document.body
            )}
        </>
    );
};

DrawerComponent.displayName = "Drawer";

export const Drawer = Object.assign(DrawerComponent, {
    Header: DrawerHeader,
    Body: DrawerBody,
});
