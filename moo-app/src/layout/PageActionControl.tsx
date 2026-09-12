import { IconButton, IconLinkButton, Input, type PageAction } from "@andrewmclachlan/moo-ds";

export const PageActionControl: React.FC<PageActionControlProps> = ({ action }) => {

    /* A disabled link is still navigable, so a disabled action renders as a
       button rather than an anchor that ignores the flag. */
    if (action.to !== undefined && !action.disabled) {
        return (
            <IconLinkButton
                badge={action.icon !== undefined}
                icon={action.icon}
                variant={action.variant ?? "primary"}
                to={action.to}
            >
                {action.label}
            </IconLinkButton>
        );
    }

    if (action.checked !== undefined) {
        return (
            <Input.Switch
                id={action.id}
                label={action.label}
                checked={action.checked}
                disabled={action.disabled}
                onChange={action.onClick}
            />
        );
    }

    return (
        <IconButton
            badge={action.icon !== undefined}
            icon={action.icon}
            variant={action.variant ?? "primary"}
            disabled={action.disabled}
            onClick={action.to !== undefined ? undefined : action.onClick}
        >
            {action.label}
        </IconButton>
    );
};

PageActionControl.displayName = "PageActionControl";

export interface PageActionControlProps {
    action: PageAction;
}
