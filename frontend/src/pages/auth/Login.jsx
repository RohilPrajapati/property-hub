import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import { isAuthenticated } from "../../helpers";

function Login() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    setAuth(isAuthenticated());
  }, []);

  if (auth === null) return null; // or loading spinner

  return auth ? (
    <Navigate to="/cleanup/report" replace />
  ) : (
    <div>
      <LoginForm />
    </div>
  );
}

export default Login;
