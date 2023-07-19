import React, { Component } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Comment, ...props }) => {
  return props.loggedIn ? (
    <Component {...props} />
  ) : (
    <Navigate to="/sign-in" replace />
  );
};

export default ProtectedRoute;
