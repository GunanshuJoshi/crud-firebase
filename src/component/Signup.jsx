import React, { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
const Signup = () => {
  const navigate = useNavigate();
  const { login, setLogin, setEmail } = useContext(AuthContext);

  useEffect(() => {
    if (login) {
      navigate("/");
    }
  }, [login]);

  const signup = async (email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const userCred = res.user;
      if (!userCred.email) {
        throw new Error("Credentials Not found");
      }
      setEmail(userCred.email);
      setLogin(true);
    } catch (error) {
      console.log("Failed to Sign Up : ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const email = data.get("email");
    const password = data.get("password");
    await signup(email, password);
  };
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Create a New Account
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
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?
          <button
            onClick={() => navigate("/signin")}
            className="text-blue-600 font-medium hover:underline ml-1"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
