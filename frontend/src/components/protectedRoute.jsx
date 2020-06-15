import React from 'react';
import { getCurrentUser } from "../services/authService";
import { Route, Redirect } from "react-router-dom";

export default function ProtectedRoute({ path, component: Component, render, ...rest }) {
    return (
        <Route
            {...rest}
            render={props => {
                if (!getCurrentUser()) return <Redirect to={{
                    pathname: "/login",
                    state: { from: props.location }
                }} />
                return Component ? <Component {...props} /> : render(props);
            }} />
    )
}
