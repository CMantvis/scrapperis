import axios from "axios";
import jwtDecode from "jwt-decode";

const apiEndpoint = `https://mysterious-journey-11608.herokuapp.com/api/auth/login`;

export function logUser(login, password) {
    return axios.post(apiEndpoint, { email: login, password: password });
};

export function getCurrentUser () {
    try {
        const jwt = localStorage.getItem("token")
        return jwtDecode(jwt)
      }
      catch(ex) {
          return null
      }
};