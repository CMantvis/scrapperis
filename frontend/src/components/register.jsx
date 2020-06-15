import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import Input from "./input";
import * as userService from "../services/userService";

export default function Register() {
    let history = useHistory();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [errors, setErrors] = useState({});

    const handleLogin = e => {
        setLogin(e.target.value);
    };

    const handlePassword = e => {
        setPassword(e.target.value);
    };

    const handlePassword2 = e => {
        setPassword2(e.target.value);
    };

    const validate = () => {
        const errors = {};

        if (login.trim() === "") {
            errors.email = "Email is required."
        }

        if (password.trim() === "") {
            errors.password = "Password is required"
        }

        if (password2.trim() === "") {
            errors.password2 = "Password is required"
        }

        if (password.trim() !== password2.trim()) {
            errors.password2 = "Passwords must match each other"
        }
        return Object.keys(errors).length === 0 ? null : errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errors = validate();
        if (errors === null) {
            setErrors({})
        } else {
            setErrors(errors)
        }
        if (errors) return

        try {
            await userService.register(login, password, password2);
            history.push("/");
            window.location.reload(true);
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                const error = { ...errors }
                error.email = ex.response.data
                setErrors(error)
            }
        }
    };

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
                        <Input type="password" value={password2}
                            onChange={handlePassword2}
                            name="password2"
                            error={errors.password2}
                            placeholder="Repeat password" />
                        <button type="submit" className="btn btn-primary" style={{ marginTop: "5px" }}>Submit</button>
                    </div>
                </div>
            </form>
        </div>
    )
}
