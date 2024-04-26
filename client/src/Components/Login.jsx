import React from "react";
import { Link } from "react-router-dom";
import Google from "../assets/google.png"
const Login = () => {
  return (
    <section className="login">
      <div className="container">
        <h1 className="heading">Welcome Back!</h1>
        <p className="text">
          Enter your details below to sign in your account.
        </p>

        <form>
          <div className="input-field email">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="input-field password">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
            />
          </div>
          <Link to="/forgot-password" className="forgotPassword">
            Forgot Password?
          </Link>
          <button className="submit" type="submit">
            Login
          </button>
        </form>

        <div className="or">
          <span className="line">or</span>
        </div>
        <button className="login-with">
          <Link to="/">
            <img src={Google} alt="" />
            <span> Continue with Google</span>
          </Link>
        </button>
      </div>
    </section>
  );
};

export default Login;
