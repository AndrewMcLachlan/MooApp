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
          text: "Settings",
          route: "/",
          image: <Tags />
        }
      ]}/>
      <Layout.Main>
        <Routes>
          <Route path="/" element={<Components />} />
        </Routes>
      </Layout.Main>
      <Layout.Footer copyrightYear={2022} />
    </Layout>
  );
}

export default App;
