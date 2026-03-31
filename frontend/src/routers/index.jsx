import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import NoAuthLayout from "../layouts/NoAuthLayout.jsx";
import NotFound from "../pages/NotFound.jsx";
import PropertyListing from "../pages/properties/PropertyListing.jsx";
import PropertyDetail from "../pages/properties/PropertyDetail.jsx";
import { isAuthenticated } from "../helpers";

function AppRoutes() {
  const isAuth = isAuthenticated();

  return (
    <Routes>
      {/* 1. COMPLETELY PUBLIC: Visible whether logged in or not */}
      {/* We don't wrap this in a "Redirect" layout */}
      <Route element={<NoAuthLayout />}>
        <Route path="/" element={<PropertyListing />} />
        <Route path="/listings/:propertyId" element={<PropertyDetail />} />
      </Route>

      {/* 2. GUEST ONLY: Only visible if NOT logged in */}
      {/* If a user is already logged in and goes to /login, send them home */}
      <Route
        path="/login"
        element={isAuth ? <Navigate to="/" replace /> : <Login />}
      />

      {/* 3. PROTECTED ROUTES: Only visible if logged in */}
      <Route element={<AuthLayout />}>
        {/* Add your private pages here, like /dashboard or /profile */}
        {/* <Route path="/add-property" element={<AddProperty />} /> */}
      </Route>

      {/* 4. CATCH-ALL */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;