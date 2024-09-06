import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const DELETE = "delete";
export const GET = "get";
export const POST = "post";
export const PUT = "put";

const instance = axios.create({
  baseURL: `https://${document.domain}/`,
  timeout: 600000,
});

instance.interceptors.request.use(
  async (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          console.info("token has expired. Attempting to renew token...");
          // Token has expired, make a call to get new token
          const response = await axios.get(
            `/insightweb/headerInformation?t=${currentTime}`
          );
          const newToken = response.data.jwtToken;

          if (newToken) {
            console.info("token renewed");
            // Update the token in session storage
            sessionStorage.setItem("access_token", newToken);
            // Retry the original API call with the new token
            config.headers["Authorization"] = `Bearer ${newToken}`;
          } else {
            //no token is returned, user has been logged-out after too long of a duration
            console.info("user session has expired");
            window.location.reload();
          }
        } else {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("invalid token error");
      }
    }
    return config;
  },
  (error) => {
    if (error.response.status == 401) {
      document.location.href = "/insightweb/login";
    } else {
      return Promise.reject(error);
    }
  }
);

export default instance;
