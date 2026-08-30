/**
 * Whether the browser implements the Popover API.
 *
 * Overlays that need to sit above everything (tooltips, popovers) render into
 * the top layer via `popover="manual"` plus `showPopover()`, because a z-index
 * -- however large -- is still painted below a top-layer element such as an
 * open `<dialog>`.
 *
 * The attribute is applied only when the API is present. A `popover` element
 * is `display: none` until it is opened, so adding the attribute somewhere
 * `showPopover()` does not exist (jsdom, or a browser predating the API) would
 * hide the overlay outright and drop it from the accessibility tree.
 */
export const supportsPopover = (): boolean =>
    typeof HTMLElement !== "undefined" && typeof HTMLElement.prototype.showPopover === "function";

/**
 * Spreadable `popover="manual"` attribute, empty where the API is unavailable.
 * "manual" rather than "auto" because these overlays manage their own
 * dismissal -- "auto" adds light-dismiss and closes them on any outside click,
 * which would fight the components' existing open/close state.
 */
export const topLayerProps = (): { popover?: "manual" } =>
    supportsPopover() ? { popover: "manual" } : {};

/**
 * Move an element into the top layer, where the API allows it.
 *
 * Guards on the element's own method rather than on supportsPopover(), so the
 * check is against the thing actually being called. Both have to agree: the
 * popover attribute is only applied where showPopover is callable, so calling
 * it where it is not would mean invoking the API on an element that never got
 * the attribute.
 *
 * Calling this on an already-open popover is a no-op rather than an error, so
 * an effect that re-runs does not need to track whether it has already shown.
 */
export const showInTopLayer = (element: HTMLElement | null | undefined): void => {
    if (element && typeof element.showPopover === "function") {
        element.showPopover();
    }
};

/**
 * Take an element back out of the top layer.
 *
 * Guarded the same way as showInTopLayer, and additionally on the element
 * still being open: hidePopover() throws if the popover is not currently
 * showing, which happens when a component unmounts while closed.
 */
export const hideFromTopLayer = (element: HTMLElement | null | undefined): void => {
    if (element && typeof element.hidePopover === "function" && element.matches(":popover-open")) {
        element.hidePopover();
    }
};
