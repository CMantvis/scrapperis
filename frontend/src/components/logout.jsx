import { useEffect } from 'react';
import { useHistory } from "react-router-dom";

export default function Logout() {
    let history = useHistory();
    useEffect(() => {
        localStorage.removeItem("token");
        history.push("/");
        window.location.reload(true);
    }, []);
    return null;
}
