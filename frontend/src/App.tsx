import { RouterProvider } from "react-router";
import { router } from "./app/router/AppRouter";

export const App = () => {
  return <RouterProvider router={router} />;
};
