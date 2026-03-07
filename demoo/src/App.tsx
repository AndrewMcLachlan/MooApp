import "./App.css";
import "../../moo-ds/src/css/mooapp.css";

import { MooAppLayout } from "@andrewmclachlan/moo-app";
import { Icon, SearchBox } from "@andrewmclachlan/moo-ds";
import { useIsAuthenticated } from "@azure/msal-react";
import { Link } from "@tanstack/react-router";
import { Application, Budget, Dashboard, Tags, User, Stack, Users, Sliders } from "@andrewmclachlan/moo-icons";

const App = () => {

  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) return null;

  const sidebarNav = [
    {
      text: "Home",
      route: "/",
      image: <Icon icon={Application} />
    },
    {
      text: "Components",
      route: "/components",
      image: <Icon icon="https://avatars.githubusercontent.com/u/3093264?v=4" />
    },
    {
      text: "Overlays",
      route: "/overlays",
      image: <Icon icon={Sliders} />
    },
    {
      text: "Forms",
      route: "/form",
      image: <Icon icon={User} />
    },
    {
      text: "Notifications",
      route: "/notifications",
      image: <Stack />
    },
    {
      text: "Providers",
      route: "/providers",
      image: <Budget />
    },
    {
      text: "Error Page",
      route: "/error-page",
      image: <Users />
    },
    {
      text: "Table",
      route: "/table",
      image: <Icon icon={Tags} />
    },
    {
      text: "Data Grid",
      route: "/data-grid",
      image: <Icon icon={Tags} />
    },
    {
      text: "Icons",
      route: "/icons",
      image: <Icon icon={Dashboard} />
    }
  ];

  return (
    <MooAppLayout
      header={{ menu: [<Link to="/"><Tags /></Link>], search: <SearchBox />, userMenu: [{ route: "/profile", text: "Profile", image: <Icon icon={User} /> }, { route: "/settings", text: "Settings", image: <Icon icon={Sliders} /> }], showAppInfo: true }}
      sidebar={{ navItems: sidebarNav }}
    />
  );
}

export default App;
