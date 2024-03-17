import ReactDOM from "react-dom/client";
import App from "./App";
import { Alerts, ErrorBoundary, IconLinkButton, Layout, MooApp, createMooAppBrowserRouter } from "@andrewmclachlan/mooapp";
import reportWebVitals from './reportWebVitals';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Components } from './pages/Components';
import { Providers } from './pages/Providers';
import { Home } from './pages/Home';
import { Profile } from "./pages/Profile";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowsRotate, faCheck, faCheckCircle, faTrashAlt, faChevronDown, faChevronUp, faTimesCircle, faArrowLeft, faChevronRight, faCircleChevronLeft, faLongArrowUp, faLongArrowDown, faUpload, faXmark, faFilterCircleXmark, faInfoCircle, faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { IconLinkButtonComponent } from "./pages/components/IconLinkButtonComponent";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

console.debug((import.meta as any).env);
console.debug((import.meta as any).env.VITE_REACT_APP_VERSION);

library.add(faArrowsRotate, faCheck, faCheckCircle, faTrashAlt, faChevronDown, faChevronUp, faTimesCircle, faArrowLeft, faLongArrowUp, faLongArrowDown, faChevronRight, faCircleChevronLeft, faUpload, faXmark, faFilterCircleXmark, faInfoCircle, faPenToSquare, faPlus);

const router = createMooAppBrowserRouter({
  layout: {
    path: "/", element: <App />, children: {
      home: { path: "/", element: <Home /> },
      components: { path: "/components", element: <Components /> },
      providers: { path: "/providers", element: <Providers /> },
      componentsSubcomponents: { path: "/components/iconlinkbutton", element: <IconLinkButtonComponent /> },
      settings: { path: "/settings", element: <Components /> },
      profile: {path: "/profile", element: <Profile />},
    }
  }
});


root.render(
  <MooApp clientId="045f8afa-70f2-4700-ab75-77ac41b306f7" scopes={["api://moobank.mclachlan.family/api.read"]} name="DeMoo" version={(import.meta as any).env.VITE_REACT_APP_VERSION}>
    {/*<App />*/}
    <RouterProvider router={router} />

  </MooApp>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
//596dfa38-50f8-4b83-8513-dfd3473d2072
