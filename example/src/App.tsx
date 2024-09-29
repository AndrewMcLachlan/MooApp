import "./App.scss";

import { Icon, MooAppLayout, SearchBox } from "@andrewmclachlan/mooapp";
import { useIsAuthenticated } from "@azure/msal-react";
import { Link } from "react-router-dom";
import { Tags } from "./assets";

const App = () => {

  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) return null;

  const sidebarNav = [
    {
      text: "Home",
      route: "/",
      image: <Icon icon={Tags} />
    },
    {
      text: "Components",
      route: "/components",
      image: <Tags />
    },
    {
      text: "Providers",
      route: "/providers",
      image: <Tags />
    },
    {
      text: "Tag Panel",
      route: "/tag-panel",
      image: <Tags />
    }

  ];

  return (
    <MooAppLayout
      header={{ menu: [<Link to="/"><Tags /></Link>], search: <SearchBox />, userMenu: [{ route: "/profile", text: "Profile" }] }}
      sidebar={{ navItems: sidebarNav }}
      footer={{ copyrightYear: 2022 }}
    />
  );
}

export default App;
