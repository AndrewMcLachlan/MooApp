import "./App.css";
import "../../moo-ds/src/css/mooapp.css";

import { MooAppLayout } from "@andrewmclachlan/moo-app";
import { Icon, SearchBox } from "@andrewmclachlan/moo-ds";
import { useIsAuthenticated } from "@azure/msal-react";
import { Link } from "react-router";
import { Application, Budget, Tags, User, Stack, Users } from "@andrewmclachlan/moo-icons";

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
      id: "table",
      text: "Table",
      onClick: () => alert("Table Clicked"),
      image: <Icon icon={Tags} />
    }
  ];

  return (
    <MooAppLayout
      header={{ menu: [<Link to="/"><Tags /></Link>], search: <SearchBox />, userMenu: [{ route: "/profile", text: "Profile" }] }}
      sidebar={{ navItems: sidebarNav }}
    />
  );
}

export default App;
