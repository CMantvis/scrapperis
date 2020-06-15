import axios from "axios";


const apiEndpoint =`https://mysterious-journey-11608.herokuapp.com/api/users/signup`

export function register(login,password,password2) {
    return axios.post(apiEndpoint, {
        email: login,
        password: password,
        password2: password2
    });
};

