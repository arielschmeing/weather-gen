import { ROUTER_PATHS } from "@/lib/app.constants";
import { LoginPage } from "@/pages/Login";
import { RegisterPage } from "@/pages/Register";
import { createBrowserRouter } from "react-router";
import { ProtectedRouter } from "./ProtectedRouter";
import { DashboardPage } from "@/pages/Dashboard";
import { NotFound } from "@/pages/NotFound";
import { UserPage } from "@/pages/User";
import { ExplorerPage } from "@/pages/Explorer";
import { ItemPage } from "@/pages/Item";

export const router = createBrowserRouter([
  {
    path: ROUTER_PATHS.ERROR,
    element: <NotFound />,
  },
  {
    path: ROUTER_PATHS.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: ROUTER_PATHS.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTER_PATHS.ROOT,
    element: <ProtectedRouter />,
    children: [
      {
        path: ROUTER_PATHS.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: ROUTER_PATHS.USER,
        element: <UserPage />,
      },
      {
        path: ROUTER_PATHS.EXPLORER,
        children: [
          {
            index: true,
            element: <ExplorerPage />,
          },
          {
            path: ":id",
            element: <ItemPage />,
          },
        ],
      },
    ],
  },
]);
