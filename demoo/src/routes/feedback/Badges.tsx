import { Page } from "@andrewmclachlan/moo-app";
import { Section, Badge, CloseBadge } from "@andrewmclachlan/moo-ds";
import { Sparkle } from "@andrewmclachlan/moo-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { feedbackNav } from "../../nav";

const hues = ["blue", "indigo", "purple", "pink", "rose", "orange", "amber", "yellow", "green", "emerald", "teal", "cyan", "slate", "neutral"] as const;

export const Badges = () => {

    return (
        <Page title="Badges" breadcrumbs={[{ route: "/feedback/alerts", text: "Feedback" }, { route: "/feedback/badges", text: "Badges" }]} navItems={feedbackNav}>

            <Section title="Semantic" header="Semantic &mdash; solid" headerSize={4}>
                <div className="badge-row">
                    <Badge bg="primary">Primary</Badge>
                    <Badge bg="secondary">Secondary</Badge>
                    <Badge bg="success">Success</Badge>
                    <Badge bg="danger">Danger</Badge>
                    <Badge bg="warning">Warning</Badge>
                    <Badge bg="info">Info</Badge>
                </div>
                <div className="badge-row">
                    <Badge pill bg="primary">Primary</Badge>
                    <Badge pill bg="secondary">Secondary</Badge>
                    <Badge pill bg="success">Success</Badge>
                    <Badge pill bg="danger">Danger</Badge>
                    <Badge pill bg="warning">Warning</Badge>
                    <Badge pill bg="info">Info</Badge>
                </div>
            </Section>

            <Section title="Hues" header="Hues" headerSize={4}>
                <h5>Solid</h5>
                <div className="badge-row">
                    {hues.map((h) => <Badge key={h} bg={h}>{h[0].toUpperCase() + h.slice(1)}</Badge>)}
                </div>
                <h5>Muted</h5>
                <div className="badge-row">
                    {hues.map((h) => <Badge key={h} bg={h} muted>{h[0].toUpperCase() + h.slice(1)}</Badge>)}
                </div>
                <h5>Outline</h5>
                <div className="badge-row">
                    {hues.map((h) => <Badge key={h} bg={h} outline>{h[0].toUpperCase() + h.slice(1)}</Badge>)}
                </div>
                <h5>Pill</h5>
                <div className="badge-row">
                    {hues.map((h) => <Badge key={h} bg={h} pill>{h[0].toUpperCase() + h.slice(1)}</Badge>)}
                </div>
            </Section>

            <Section title="Custom colour" header="Custom colour" headerSize={4}>
                <div className="badge-row">
                    <Badge colour="#7c6cff">Hex</Badge>
                    <Badge colour="rgb(255, 99, 132)">RGB</Badge>
                    <Badge colour="hsl(160, 70%, 45%)">HSL</Badge>
                    <Badge colour="var(--primary)">CSS var</Badge>
                    <Badge colour="#fde68a" textColour="#78350f">Light bg / dark text</Badge>
                    <Badge colour="#7c6cff" muted>Custom muted</Badge>
                    <Badge colour="#7c6cff" outline>Custom outline</Badge>
                </div>
            </Section>

            <Section title="With icon" header="With icon" headerSize={4}>
                <div className="badge-row">
                    <Badge bg="primary" icon={<FontAwesomeIcon icon="star" />}>Featured</Badge>
                    <Badge bg="success" icon={<FontAwesomeIcon icon="check" />}>Done</Badge>
                    <Badge bg="danger" icon={<FontAwesomeIcon icon="circle-xmark" />}>Failed</Badge>
                    <Badge bg="warning" icon={<FontAwesomeIcon icon="triangle-exclamation" />}>Warning</Badge>
                </div>
                <div className="badge-row">
                    <Badge bg="indigo" muted icon={<FontAwesomeIcon icon="bolt" />}>Muted</Badge>
                    <Badge bg="teal" outline icon={<FontAwesomeIcon icon="leaf" />}>Outline</Badge>
                    <Badge bg="rose" pill icon={<FontAwesomeIcon icon="heart" />}>Pill</Badge>
                    <Badge colour="#7c6cff" muted icon={<FontAwesomeIcon icon="bolt" />}>Custom + muted</Badge>
                </div>
                <h5>With Moo icon</h5>
                <div className="badge-row">
                    <Badge bg="purple" icon={<Sparkle />}>Sparkle</Badge>
                    <Badge bg="indigo" muted icon={<Sparkle />}>AI</Badge>
                    <Badge bg="amber" outline pill icon={<Sparkle />}>New</Badge>
                    <Badge colour="#7c6cff" icon={<Sparkle />}>Featured</Badge>
                </div>
            </Section>

            <Section title="Close badges" header="CloseBadge" headerSize={4}>
                <p>A badge with a built-in remove button &mdash; used for removable tags and filters.</p>
                <div className="demo-row tight">
                    <CloseBadge bg="primary" onClose={() => console.log("Removed: React")}>React</CloseBadge>
                    <CloseBadge bg="success" onClose={() => console.log("Removed: TypeScript")}>TypeScript</CloseBadge>
                    <CloseBadge bg="info" onClose={() => console.log("Removed: Vite")}>Vite</CloseBadge>
                    <CloseBadge bg="warning" onClose={() => console.log("Removed: Node.js")}>Node.js</CloseBadge>
                </div>
            </Section>

        </Page>
    );
}
