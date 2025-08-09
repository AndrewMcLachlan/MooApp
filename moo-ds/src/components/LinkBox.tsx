import classNames from "classnames";
import { PropsWithChildren, ReactNode } from "react";
import { useLink } from "../providers/LinkProvider";

export const LinkBox: React.FC<PropsWithChildren<LinkBoxProps>> = ({ href, to, children, image, className, ...rest }) => {

    const LinkComponent = useLink();

    let imageComponent = image;

    if (typeof image === "string") {
        imageComponent = <img src={image as string} alt="" />;
    }

    let component =
        <>
            <div className="link-box-img">{imageComponent}</div>
            <div className="link-box-text">{children}</div>
        </>;

    const combinedClassName = classNames("link-box", className);

    if (href) {
        component = <a href={href} rel="noreferrer" {...rest} className={combinedClassName}>
            {component}
        </a>;
    }
    else if (to) {
        component = <LinkComponent to={to} className={combinedClassName} {...rest}>{component}</LinkComponent>;
    }
    else {
        component = <div className={combinedClassName} {...rest}>{component}</div>;
    }

    return component;
}

LinkBox.displayName = "LinkBox";

export interface LinkBoxProps extends React.HTMLAttributes<HTMLElement> {
    href?: string;
    to?: string;
    image?: string | ReactNode;
}
