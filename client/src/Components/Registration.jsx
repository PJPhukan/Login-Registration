import React from "react";
import { Link } from "react-router-dom";
import Google from "../assets/google.png";

const Registration = () => {
  return (
    <section className="registration">
      <div className="container">
        <h1 className="heading">Welcome!</h1>
        <p className="text">Enter your details below to create an account.</p>

        <form>
          <div className="input-field username">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
            />
          </div>
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
          <div className="input-field number">
            <label htmlFor="number">Phone number</label>
            <input
              type="text"
              name="password"
              id="number"
              placeholder="Enter your number"
            />
          </div>
          <button className="submit" type="submit">
            Sign in
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

export default Registration;
