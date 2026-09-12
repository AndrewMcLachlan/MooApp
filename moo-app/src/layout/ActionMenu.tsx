import { Icon, Menu, type PageAction } from "@andrewmclachlan/moo-ds";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ActionMenu: React.FC<ActionMenuProps> = ({ actions }) => {

    if (actions.length === 0) return null;

    const read = actions.filter(a => (a.group ?? "read") === "read");
    const write = actions.filter(a => a.group === "write");

    const item = (action: PageAction) => (
        <Menu.Item
            key={action.id}
            icon={action.icon && <Icon icon={action.icon} />}
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

export interface ActionMenuProps {
    actions: PageAction[];
}
