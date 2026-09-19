import { MenuToggle, useLink } from "@andrewmclachlan/moo-ds";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type HeaderComponent } from "../Types";
import { useLayout } from "../../providers";
import { ActionMenu } from "../ActionMenu";

/** Matches what Breadcrumb draws, so a top-level page still has somewhere to go up to. */
const home = { text: "Home", route: "/" };

export const Header: HeaderComponent = () => {

    const { breadcrumbs, actions, customActions, setShowSidebar } = useLayout();
    const Link = useLink();

    const current = breadcrumbs?.[breadcrumbs.length - 1];
    const parent = [home, ...(breadcrumbs ?? [])].at(-2);

    return (
        <header className="d-lg-none">
            <div className="mobile-header">
                <MenuToggle controls="mobile-sidebar" onClick={() => setShowSidebar(true)} />
                {parent?.route && (
                    <Link to={parent.route} className="btn-back" aria-label={`Back to ${parent.text}`} title={`Back to ${parent.text}`}>
                        <FontAwesomeIcon icon="chevron-left" />
                    </Link>
                )}
                <h1 className="page-title">{current?.text}</h1>
                {customActions}
                <ActionMenu actions={actions ?? []} />
            </div>
        </header>
    );
};
