import { createBrowserRouter, RouterProvider } from "react-router";
import { AppLayout } from "./layouts/AppLayout";
import { RootLayout, rootLayoutLoader } from "./layouts/RootLayout";
import { authMiddleware } from "./contexts/UserContextProvider";
const tag = () => import("./page/tags");
const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    middleware: [authMiddleware],
    loader: rootLayoutLoader,
    children: [
      {
        path: "login",
        lazy: () => import("./page/auth/login"),
      },
      {
        element: <AppLayout />,
        children: [
          {
            path: "questions",
            lazy: () => import("./page/questions"),
          },
          {
            path: "tags",
            lazy: tag,
          },
          {
            path: "/questions/create",
            lazy: () => import("./page/create-question"),
          },
          {
            path: "/questions/:id",
            lazy: () => import("./page/detail-question"),
          },
          {
            path: "/answer/:id/edit",
            lazy: () => import("./page/edit-answer"),
          },
        ],
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
