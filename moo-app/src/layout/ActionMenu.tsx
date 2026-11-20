import { Icon, Menu, useLink, type PageAction } from "@andrewmclachlan/moo-ds";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ActionMenu: React.FC<ActionMenuProps> = ({ actions }) => {

    if (actions.length === 0) return null;

    /* A menu of one hides the only thing there is to do behind an extra tap.
       A toggle stays in the menu: its state needs the tick a bare button can't show. */
    if (actions.length === 1 && actions[0].checked === undefined) {
        return <SingleAction action={actions[0]} />;
    }

    const read = actions.filter(a => (a.group ?? "read") === "read");
    const write = actions.filter(a => a.group === "write");

    const item = (action: PageAction) => (
        <Menu.Item
            key={action.id}
            icon={action.icon}
            checked={action.checked}
            disabled={action.disabled}
            onClick={action.onClick}
            to={action.to}
        >
            {action.label}
        </Menu.Item>
    );

    return (
        <Menu
            id="page-actions"
            placement="bottom"
            trigger={(
                <button type="button" className="action-menu-toggle" aria-label="More actions">
                    <FontAwesomeIcon icon="ellipsis-vertical" />
                </button>
            )}
        >
            {read.map(item)}
            {read.length > 0 && write.length > 0 && <Menu.Divider />}
            {write.map(item)}
        </Menu>
    );
};

ActionMenu.displayName = "ActionMenu";

/** The bar has room for one glyph, so an icon stands alone and names itself; without one, the label is shown. */
const SingleAction: React.FC<{ action: PageAction }> = ({ action }) => {

    const Link = useLink();

    const hasIcon = action.icon !== undefined;
    const className = hasIcon ? "page-action" : "page-action page-action-text";
    const content = hasIcon ? <Icon icon={action.icon} /> : action.label;
    const name = hasIcon ? action.label : undefined;

    /* A disabled link is still navigable, so it renders as a disabled button. */
    if (action.to !== undefined && !action.disabled) {
        return <Link to={action.to} className={className} aria-label={name} title={name}>{content}</Link>;
    }

    return (
        <button
            type="button"
            className={className}
            aria-label={name}
            title={name}
            disabled={action.disabled}
            onClick={action.to !== undefined ? undefined : action.onClick}
        >
            {content}
        </button>
    );
};

export interface ActionMenuProps {
    actions: PageAction[];
}
