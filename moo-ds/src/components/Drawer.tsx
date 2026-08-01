import classNames from "classnames";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { hideFromTopLayer, showInTopLayer, topLayerProps } from "../utils/topLayer";

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

    const panelRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [show]);

    // Put the panel and its backdrop in the top layer, so neither can be
    // covered by page content however high its z-index. The backdrop goes
    // first: the top layer stacks in the order elements are promoted, so
    // promoting it before the panel keeps the dimming behind it.
    //
    // Nothing is taken back out on close. The panel keeps sliding for 0.3s
    // after .show is removed, and leaving the top layer mid-slide would drop it
    // behind any higher-stacked page content for the rest of the animation.
    // Both are inert while closed anyway -- the panel is visibility: hidden and
    // the backdrop display: none -- so staying there costs nothing.
    useLayoutEffect(() => {
        if (!show) return;

        showInTopLayer(backdropRef.current);
        showInTopLayer(panelRef.current);
    }, [show]);

    // Released on unmount rather than on close, for the reason above.
    useLayoutEffect(() => () => {
        hideFromTopLayer(panelRef.current);
        hideFromTopLayer(backdropRef.current);
    }, []);

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
                ref={panelRef}
                className={classNames("offcanvas", `offcanvas-${placement}`, show && "show", className)}
                tabIndex={-1}
                {...rest}
                {...topLayerProps()}
            >
                {enhancedChildren}
            </div>
            {createPortal(
                <div
                    ref={backdropRef}
                    className={classNames("offcanvas-backdrop", show && "show")}
                    onClick={onHide}
                    {...topLayerProps()}
                />,
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
