import "./App.css";
import "../../moo-app/src/css/mooapp.css";

import { Icon, MooAppLayout, SearchBox } from "@andrewmclachlan/mooapp";
import { useIsAuthenticated } from "@azure/msal-react";
import { Link } from "react-router";
import { Application, Budget, Tags, User, Stack, Users } from "@andrewmclachlan/mooicons";

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
      image: <Icon icon={User} />
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
  ];

  return (
    <MooAppLayout
      header={{ menu: [<Link to="/"><Tags /></Link>], search: <SearchBox />, userMenu: [{ route: "/profile", text: "Profile" }] }}
      sidebar={{ navItems: sidebarNav }}
    />
  );
}

export default App;
