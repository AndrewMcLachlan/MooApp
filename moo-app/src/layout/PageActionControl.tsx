import { IconButton, IconLinkButton, Input, type PageAction } from "@andrewmclachlan/moo-ds";

export const PageActionControl: React.FC<PageActionControlProps> = ({ action }) => {

    if (action.to !== undefined) {
        return (
            <IconLinkButton
                badge
                variant={action.variant ?? "primary"}
                to={action.to}
            >
                {action.icon}
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
            badge
            variant={action.variant ?? "primary"}
            disabled={action.disabled}
            onClick={action.onClick}
        >
            {action.icon}
            {action.label}
        </IconButton>
    );
};

PageActionControl.displayName = "PageActionControl";

export interface PageActionControlProps {
    action: PageAction;
}
