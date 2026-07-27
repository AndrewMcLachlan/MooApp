import { Page } from "@andrewmclachlan/moo-app";
import { Icon, Section } from "@andrewmclachlan/moo-ds";
import {
    Application, BarChart, Budget, Cog, Dashboard, Database,
    HamburgerMenu, Hierarchy, Import, LeftRightArrow, List, NestedList,
    PieChart,
    PiggyBank, PullRequest, Reports, Rules, Sliders, Sparkle, Stack, Tag,
    Tags, Trendline, TwoCoins, Transaction, UpDownArrow, User,
    UserShield, Users,
} from "@andrewmclachlan/moo-icons";

const icons = [
    { name: "Application", component: Application },
    { name: "BarChart", component: BarChart },
    { name: "Cog", component: Cog },
    { name: "Dashboard", component: Dashboard },
    { name: "Database", component: Database },
    { name: "Budget", component: Budget },
    { name: "HamburgerMenu", component: HamburgerMenu },
    { name: "Hierarchy", component: Hierarchy },
    { name: "Import", component: Import },
    { name: "LeftRightArrow", component: LeftRightArrow },
    { name: "List", component: List },
    { name: "NestedList", component: NestedList },
    { name: "PieChart", component: PieChart },
    { name: "PiggyBank", component: PiggyBank },
    { name: "PullRequest", component: PullRequest },
    { name: "Reports", component: Reports },
    { name: "Rules", component: Rules },
    { name: "Sliders", component: Sliders },
    { name: "Sparkle", component: Sparkle },
    { name: "Stack", component: Stack },
    { name: "Tag", component: Tag },
    { name: "Tags", component: Tags },
    { name: "Trendline", component: Trendline },
    { name: "TwoCoins", component: TwoCoins },
    { name: "Transaction", component: Transaction },
    { name: "UpDownArrow", component: UpDownArrow },
    { name: "User", component: User },
    { name: "UserShield", component: UserShield },
    { name: "Users", component: Users },
];

export const Icons = () => (
    <Page title="Icons" breadcrumbs={[{ route: "/icons", text: "Icons" }]}>
        <Section title="Icon" header="Icon" headerSize={4}>
            <p>
                <code>Icon</code> renders a moo-icons SVG at a consistent size and colour. Pass an icon
                component via <code>icon</code>, or an image URL via <code>src</code>. The
                {" "}<code>@andrewmclachlan/moo-icons</code> package below is the full set.
            </p>
        </Section>
        <Section title="Gallery" header="Moo Icons" headerSize={4}>
            <div className="icon-gallery">
                {icons.map(({ name, component }) => (
                    <div key={name} className="icon-gallery-item">
                        <Icon icon={component} />
                        <span>{name}</span>
                    </div>
                ))}
            </div>
        </Section>
    </Page>
);
