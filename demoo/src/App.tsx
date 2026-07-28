import "./App.css";
import "../../moo-ds/src/css/mooapp.css";

import { MooAppLayout } from "@andrewmclachlan/moo-app";
import { SearchBox } from "@andrewmclachlan/moo-ds";
import { useIsAuthenticated } from "@azure/msal-react";
import { Link } from "@tanstack/react-router";
import { Tags } from "@andrewmclachlan/moo-icons";
import { categoryNav, userMenu } from "./nav";

const App = () => {

  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) return null;

  return (
    <MooAppLayout
      header={{ menu: [<Link to="/"><Tags /></Link>], search: <SearchBox />, userMenu, showAppInfo: true }}
      sidebar={{ navItems: categoryNav }}
    />
  );
}

export default App;
