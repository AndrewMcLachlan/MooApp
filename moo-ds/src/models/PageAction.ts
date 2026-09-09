interface PageActionBase {
    /** The React key, and the id the desktop switch pairs with its label. */
    id: string;
    label: string;
    icon?: React.ReactNode;
    /** "write" sorts below the menu's separator, away from the reading toggles. */
    group?: "read" | "write";
    disabled?: boolean;
    variant?: "primary" | "secondary";
}

interface PageCommand extends PageActionBase {
    onClick: () => void;
    /** Present makes this a toggle: a switch on desktop, a ticked item in a menu. */
    checked?: boolean;
    to?: never;
}

/**
 * Navigation stays an anchor. Collapsing it to a handler costs middle-click,
 * open-in-new-tab and copy-link.
 */
interface PageLink extends PageActionBase {
    to: string;
    onClick?: never;
    checked?: never;
}

/**
 * A page action described rather than rendered, so each header can present it
 * in the form that fits: a control in a row on desktop, an item in a menu on a
 * phone. A node can only be placed, not re-presented, which is why `actions`
 * takes these and `customActions` takes the nodes.
 */
export type PageAction = PageCommand | PageLink;
