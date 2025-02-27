import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";

const Signin = () => {
  const navigate = useNavigate();
  const { setEmail, setLogin, login } = useContext(AuthContext);

  useEffect(() => {
    if (login) {
      navigate("/");
    }
  }, [login]);

  const signIn = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const userCred = res.user;
      console.log("🚀 ~ signIn ~ userCred:", userCred.email);
      if (!userCred.email) {
        throw new Error("Credentials Not found");
      }
      setEmail(userCred.email);
      setLogin(true);
    } catch (error) {
      console.log("Failed to Login: ", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const email = data.get("email");
    const password = data.get("password");
    await signIn(email, password);
  };
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login to Your Account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-600 font-medium hover:underline ml-1"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signin;
