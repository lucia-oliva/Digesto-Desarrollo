/* eslint-disable react/prop-types */
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/useAuth";

const RouteGuard = ({
  mode = "auth",
  redirectTo = "/login",
  fallbackTo = "/admin",
}) => {
  const { auth } = useAuth();
  const isLoggedIn = !!auth.user;

  if (mode === "auth" && !isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  if (mode === "guest" && isLoggedIn) {
    return <Navigate to={fallbackTo} replace />;
  }

  return <Outlet />;
};

export default RouteGuard;
