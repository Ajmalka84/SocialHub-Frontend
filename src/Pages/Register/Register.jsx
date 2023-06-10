

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import axios from "axios";
import Input from "../../Components/Input/Input";

import { toast, Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
const schema = yup.object({
  username: yup.string().required("Username required."),
  email: yup.string().required("Email required.").email("Email is not valid"),
  mobile: yup
    .string()
    .required("Mobile Number required")
    .matches(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "Mobile Number is not Valid"
    ),
  password: yup.string().min(6, "Password must be atleast 6 charecters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password must be match"),
});
function Register() {
  // const [form, setForm] = useState(null);
  const [Error, setError] = useState("");
  
  const [userData, setUserData] = useState({});
  const Navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSignup(data) {
    console.log(data)
    await axios
      .post("https://socialhub.website/auth/register", {
        username: data.username,
        email: data.email,
        password: data.password,
        mobile: data.mobile,
      })
      .then((result) => {
        console.log(result.data);
        setTimeout(() => {
          toast.success("Registration Success");
        }, 10);
        Navigate("/login");
      })
      .catch((error) => {
        if(error.response.data.keyPattern.email > 0){
          toast.error("email already registered")
        }else if (error.response.data.keyPattern.mobile > 0){
          toast.error("mobile already registered");
        }else{
          toast.error("something went wrong. please try again");
        }
        console.log(error);
      });
  }

  const navigate = useNavigate();
  const redirect = () => {
    navigate("/login");
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="logoRegister">Social Hub</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Social Hub.
          </span>
        </div>
        <div className="loginRight">
          <Toaster toastOptions={{ duration: 4000 }} />
          <div id="recaptcha-container"></div>
          <form onSubmit={handleSubmit(onSignup)} className="loginBox2">
            <Input
              id="username"
              placeholder="Username"
              type="text"
              register={{ ...register("username") }}
              errorMessage={errors.username?.message}
            />
            <Input
              id="email"
              placeholder="Email"
              type="email"
              register={{ ...register("email") }}
              errorMessage={errors.email?.message}
            />
            <Input
              id="mobile"
              placeholder="Mobile"
              type="mobile"
              register={{ ...register("mobile") }}
              errorMessage={errors.mobile?.message}
            />
            <Input
              id="password"
              placeholder="Password"
              type="password"
              register={{ ...register("password") }}
              errorMessage={errors.password?.message}
            />
            <Input
              id="confirmPassword"
              placeholder="confirm Password"
              type="password"
              register={{ ...register("confirmPassword") }}
              errorMessage={errors.confirmPassword?.message}
            />

            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <button onClick={redirect} className="loginRegisterButton">
              Log into Account
            </button>
            {Error && <p className="errorMessage">{Error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;


