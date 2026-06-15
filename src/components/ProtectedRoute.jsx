import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../layouts/Layout";

const ProtectedRoute = ({
  children,
  allowedRoles,
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" />;
  }

  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;