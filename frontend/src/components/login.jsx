import React, { useState } from 'react';
import Input from "./input";
import { useHistory, Redirect } from "react-router-dom";
import { logUser } from "../services/authService";
import { getCurrentUser } from "../services/authService";

export default function Register(props) {
    let history = useHistory();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const handleLogin = e => {
        setLogin(e.target.value);
    };

    //basic form validation
    const validate = () => {
        const errors = {};
        if (login.trim() === "") {
            errors.email = "Email is required."
        }

        if (password.trim() === "") {
            errors.password = "Password is required"
        }
        return Object.keys(errors).length === 0 ? null : errors;
    }

    const handlePassword = e => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // basic form validation
        const errors = validate();
        if (errors === null) {
            setErrors({})
        } else {
            setErrors(errors)
        }
        if (errors) return

        try {
            const response = await logUser(login, password);
            localStorage.setItem("token", response.headers["x-auth-token"]);
            const { state } = props.location;
            if (state) {
                history.push(state.from.pathname);
                window.location.reload(true);
            } else {
                history.push("/");
                window.location.reload(true);
            }
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                const error = { ...errors }
                error.email = ex.response.data
                setErrors(error)
            }
        }
    }

    // check if the user is currently loged in and redirect to homepage if he is
    if (getCurrentUser()) return <Redirect to="/" />

    return (
        <div className="container">
            <form style={{ marginTop: "40px" }} className="form" onSubmit={handleSubmit}>
                <div className="row ">
                    <div className="form-group mx-sm-3 mb-2">
                        <Input type="email" value={login}
                            onChange={handleLogin}
                            name="email"
                            error={errors.email}
                            placeholder="Email" />
                        <Input type="password" value={password}
                            onChange={handlePassword}
                            name="password"
                            error={errors.password}
                            placeholder="password" />
                        <button type="submit" className="btn btn-primary" style={{ marginTop: "5px" }}>Login</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

