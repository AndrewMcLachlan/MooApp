import { MenuToggle } from "@andrewmclachlan/moo-ds";
import { type HeaderComponent } from "../Types";
import { useLayout } from "../../providers";
import { ActionMenu } from "../ActionMenu";

export const Header: HeaderComponent = () => {

    const { breadcrumbs, actions, customActions, setShowSidebar } = useLayout();

    const current = breadcrumbs?.[breadcrumbs.length - 1];

    return (
        <header className="d-lg-none">
            <div className="mobile-header">
                <MenuToggle onClick={() => setShowSidebar(true)} />
                <h1 className="page-title">{current?.text}</h1>
                {customActions}
                <ActionMenu actions={actions ?? []} />
            </div>
        </header>
    );
};
