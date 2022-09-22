import { useIsAuthenticated } from "@azure/msal-react";
import { PropsWithChildren } from "react";

export type ArticleComponent = React.FC<PropsWithChildren<unknown>>;

export const Article: ArticleComponent = ({ children }) => {

    const isAuthenticated = useIsAuthenticated();

    return (
        <article>
            {isAuthenticated && children}
        </article>
    );
};