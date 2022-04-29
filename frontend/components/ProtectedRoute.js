import React from 'react';
import { Route, Navigate } from 'react-router-dom';

export const ProtectedRoute = (props) => {
  const { children, ...rest } = props;

  if (localStorage.getItem("token")) {
    return children
  }

  return <Navigate to="/" />
}