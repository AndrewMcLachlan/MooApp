import { Layout, useHttpClient } from "@andrewmclachlan/mooapp";
import React from "react";
import "./App.scss";
import { Route, Routes } from "react-router-dom";
import { Components } from "./pages/Components";
import { useIsAuthenticated } from "@azure/msal-react";

const App = () => {

  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) return null;

return (
  <Layout size="small">
    <Layout.Header AppName="DeMoo" Menu={[]} />

    <Layout.Article>
      <Routes>
        <Route path="/" element={<Components />} />
      </Routes>
    </Layout.Article>
    <Layout.Footer copyrightYear={2022} />
  </Layout>
);
}

export default App;
