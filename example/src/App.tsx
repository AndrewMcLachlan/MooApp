import "./App.scss";

import { Layout } from "@andrewmclachlan/mooapp";
import { Route, Routes } from "react-router-dom";
import { Components } from "./pages/Components";
import { useIsAuthenticated } from "@azure/msal-react";
import { ReactComponent as Tags } from "./assets/tags.svg";

const App = () => {

  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) return null;

  return (
    <Layout size="small">
      <Layout.Header AppName="DeMoo" Menu={[]} />
      <Layout.Breadcrumb />
      <Layout.Sidebar navItems={[
        {
          text: "Home",
          route: "/",
          image: <Tags />
        },
        {
          text: "Components",
          route: "/components",
          image: <Tags />
        }
      ]} />
      <Routes>
        <Route path="/" element={<Components />} />
        <Route path="/components" element={<Components />} />
        <Route path="/components/subcomponents" element={<Components />} />
        <Route path="/settings" element={<Components />} />
      </Routes>
      <Layout.Footer copyrightYear={2022} />
    </Layout>
  );
}

export default App;
