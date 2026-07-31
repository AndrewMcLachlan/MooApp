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
 * hide the overlay outright and drop it from the accessibility tree. Feature
 * detecting keeps those environments on the previous z-index behaviour.
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
