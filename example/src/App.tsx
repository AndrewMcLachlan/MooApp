import "./App.scss";

import { MooAppLayout, SearchBox, createMooAppBrowserRouter } from "@andrewmclachlan/mooapp";
import { Components } from "./pages/Components";
import { useIsAuthenticated } from "@azure/msal-react";
import { Tags } from "./assets";
import { Home } from "./pages/Home";
import { Providers } from "./pages/Providers";
import { Link } from "react-router-dom";

const App = () => {

  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) return null;

  const sidebarNav = [
    {
      text: "Home",
      route: "/",
      image: <Tags />
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
