import "./App.scss";

import { MooAppLayout, SearchBox } from "@andrewmclachlan/mooapp";
import { useIsAuthenticated } from "@azure/msal-react";
import { Link } from "react-router-dom";
import { Budget, Stack, Tags, User, Users, UserShield } from "@andrewmclachlan/mooicons";

const App = () => {

  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) return null;

  const sidebarNav = [
    {
      text: "Home",
      route: "/",
      image: <User />
    },
    {
      text: "Components",
      route: "/components",
      image: <UserShield />
    },
    {
      text: "Providers",
      route: "/providers",
      image: <Users />
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

export  default App;
