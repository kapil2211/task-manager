import { useAppSelector } from "../app/hooks";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
const ProtectedRoute = ({ children }: { children:  ReactNode }) => {
  const { token } = useAppSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
