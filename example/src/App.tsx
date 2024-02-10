import "./App.scss";

import { Alerts, Layout, SearchBox } from "@andrewmclachlan/mooapp";
import { Route, Routes } from "react-router-dom";
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
    <Layout size="small">
      <Alerts />
      <Layout.Header Menu={[<Link to="/"><Tags /></Link>]} Search={<SearchBox />} />
      <Layout.MobileHeader Menu={[<Link to="/"><Tags /></Link>]} />
      <Layout.Sidebar navItems={sidebarNav} />
      <Layout.MobileSidebar navItems={sidebarNav} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/components" element={<Components />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/components/subcomponents" element={<Components />} />
        <Route path="/settings" element={<Components />} />
      </Routes>
      <Layout.Footer copyrightYear={2022} />
    </Layout>
  );
}

export default App;
