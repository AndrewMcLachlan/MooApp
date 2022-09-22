import { HTMLAttributes } from "react";

export type MobileFooterComponent = React.FC<FooterProps>;

export const Footer: MobileFooterComponent = (_props) => 
<footer className="d-lg-none" />

export interface FooterProps extends HTMLAttributes<HTMLElement> {
}

Footer.displayName = "Footer";
