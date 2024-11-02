import "./App.scss";

import { Icon, MooAppLayout, SearchBox } from "@andrewmclachlan/mooapp";
import { useIsAuthenticated } from "@azure/msal-react";
import { Link } from "react-router-dom";
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
      text: "Providers",
      route: "/providers",
      image: <Budget />
    },
    {
      text: "Tag Panel",
      route: "/tag-panel",
      image: <Users />
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
      footer={{ copyrightYear: 2022 }}
    />
  );
}

export default App;
