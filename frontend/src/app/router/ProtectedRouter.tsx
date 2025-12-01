import { Layout } from "@/components/layout/Layout";
import { ROUTER_PATHS } from "@/lib/app.constants";
import { Navigate, useLocation } from "react-router";

export const ProtectedRouter = () => {
  const { pathname } = useLocation();

  if (pathname === ROUTER_PATHS.ROOT)
    return <Navigate to={ROUTER_PATHS.LOGIN} replace />;

  return <Layout />;
};
