import React from 'react'
import ReactDOM from 'react-dom/client'
import imgUrl from "./assets/k.png";
import "./index.css";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import ErrorPage from "./pages/error/Generic.jsx";
import Dashboard from "./pages/dashboard/Main.jsx"
import Messages from "./pages/messages/Main";
import Settings from "./pages/settings/Main";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "messages",
                element: <Messages />,
            },
            {
                path: "settings",
                element: <Settings />
            }
        ]
    },
]);
// set favicon
document.getElementById("favicon").setAttribute("href", imgUrl);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
