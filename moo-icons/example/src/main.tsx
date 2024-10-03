import { createRoot } from "react-dom/client"
import App from "./App.tsx"

import { createMooAppBrowserRouter, MooApp } from "@andrewmclachlan/mooapp";
import { RouterProvider } from "react-router-dom";
import { Blank } from "./pages/Blank";

const router = createMooAppBrowserRouter({
  layout: {
    path: "/", element: <App />, children: {
      components: {
        path: "/components", element: <Blank />
      },
      providers: {
        path: "/providers", element: <Blank />
      }
    }
  }
});

createRoot(document.getElementById("root")!).render(
   <MooApp clientId="045f8afa-70f2-4700-ab75-77ac41b306f7" scopes={["api://moobank.mclachlan.family/api.read"]} name="DeMoo" version={(import.meta as any).env.VITE_REACT_APP_VERSION}>
    <RouterProvider router={router} />
  </MooApp>

 );
