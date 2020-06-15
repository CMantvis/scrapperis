import React, { useState, useEffect } from 'react';
import axios from "axios";

export default function Profile(props) {
    const [profile, setProfile] = useState([]);

    useEffect(() => {
        axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("token");
        axios.get("https://mysterious-journey-11608.herokuapp.com/api/users/me")
            .then(rez => setProfile(rez.data))
    }, []);
    return (
        <div className="container">
            <div className="email">Your email: {profile.email}</div>
            <div className="status">Your status: {profile.isAdmin ? "Admin" : "User"}</div>
        </div>
    )
}
