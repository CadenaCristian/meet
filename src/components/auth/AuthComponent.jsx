import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { Navigate, useLocation } from "react-router-dom";
export default function AuthComponent({ children }) {
    const { isAuth } = useAppSelector((state) => state.userdata);
    const { pathname } = useLocation();
    if (!isAuth) {
        return <Navigate to="/login" replace/>;
    }
    else if (isAuth && pathname === "/login") {
        return <Navigate to="/meetings" replace/>;
    }
    return children;
}
