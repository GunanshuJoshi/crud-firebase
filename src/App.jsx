import React, { useContext, useEffect, useState } from "react";
import { db } from "./utils/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router";

const App = () => {
  const { login, email, setEmail, setLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [ls, setLs] = useState([]);
  const [edit, setEdit] = useState({ edit: false, name: "", age: "", id: "" });

  useEffect(() => {
    if (!login) {
      navigate("/signin");
    }
    getData();
  }, [login]);

  const getData = async () => {
    const data = await getDocs(collection(db, "crud"));
    setLs(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const setData = async (newName, newAge) => {
    await addDoc(collection(db, "crud"), { name: newName, age: newAge });
    getData();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !age) return;
    await setData(name, parseInt(age));
    setName("");
    setAge("");
  };

  const deleteData = async (id) => {
    await deleteDoc(doc(db, "crud", id));
    getData();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!edit.id || !edit.name || !edit.age) return;
    await updateDoc(doc(db, "crud", edit.id), {
      name: edit.name,
      age: parseInt(edit.age),
    });
    setEdit({ edit: false, name: "", age: "", id: "" });
    getData();
  };
  const handleLogout = () => {
    setEmail("");
    setLogin(false);
  };
  return (
    <div className="bg-indigo-100 h-screen flex flex-col items-center p-5">
      <header className="w-full flex flex-col md:flex-row justify-between items-center bg-white shadow-md p-2 md:p-4 rounded-md max-w-md ">
        <span className="text-gray-700 font-medium mb-5">{email}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      <h1 className="text-3xl max-w-lg md:text-4xl lg:text-5xl font-bold text-gray-800 mt-6">
        Add New User
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 mt-4 rounded-lg shadow-md"
      >
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="age"
          placeholder="Enter Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>

      {edit.edit && (
        <form
          onSubmit={handleUpdate}
          className="max-w-[90%] w-80 bg-gray-100 p-4 mt-4 rounded-md"
        >
          <input
            type="text"
            value={edit.name}
            onChange={(e) => setEdit({ ...edit, name: e.target.value })}
            className="w-full mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            value={edit.age}
            onChange={(e) => setEdit({ ...edit, age: e.target.value })}
            className="w-full mb-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition"
          >
            Update
          </button>
        </form>
      )}

      <div className="w-full max-w-md mt-6 overflow-auto">
        {ls.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-white p-4 my-3 rounded-lg shadow-md"
          >
            <div>
              <p className="font-semibold text-lg">{item.name}</p>
              <p className="text-gray-600">Age: {item.age}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  setEdit({
                    edit: true,
                    name: item.name,
                    age: item.age,
                    id: item.id,
                  })
                }
                className="bg-green-400 px-3 py-1 rounded text-white hover:bg-green-500 transition"
              >
                Edit
              </button>
              <button
                onClick={() => deleteData(item.id)}
                className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
