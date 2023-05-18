
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import jwt_decode from "jwt-decode";

const AxiosWithAuth = () => {
  const { Auth, setAuth } = useContext(AuthContext);

  const AxiosJWT = axios.create({
    baseURL: "http://3.83.38.239/",
  });

  AxiosJWT.interceptors.request.use(
    async (config) => {
      try {
        let newAuth = Auth.accessToken;
        let currentDate = new Date();
        const decodedToken = jwt_decode(Auth.accessToken);
        if (decodedToken?.exp * 1000 < currentDate.getTime()) {
          console.log("its here in the interceptors");
          console.log(decodedToken);
          const res = await axios.get("http://3.83.38.239/auth/refresh", {
            withCredentials: true,
          });
          newAuth = res.data.accessToken;
          setAuth((prev) => {
            return { ...prev, ...res.data };
          });
        }
        config.headers["authorization"] = `Bearer ${newAuth}`;
        return config;
      } catch (error) {
        console.log(error);
      }
    },
    (error) => {
      console.log(error);
    }
  );
  return AxiosJWT;
};

export default AxiosWithAuth;
