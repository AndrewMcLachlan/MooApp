import { Layout } from "@andrewmclachlan/mooapp";
import React from "react";
import "./App.scss";
import { Route, Routes } from "react-router-dom";
import { Components } from "./pages/Components";

const App = () => (
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

export default App;
