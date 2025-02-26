import React, { useEffect, useState } from "react";
import { db } from "./utils/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const App = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [ls, setLs] = useState([]);
  const [edit, setEdit] = useState({ edit: false, name: "", age: "", id: "" });

  useEffect(() => {
    getData();
  }, []);

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

  return (
    <div className="bg-indigo-200 h-screen flex flex-col items-center p-5">
      <h1 className="text-2xl  md:text-4xl lg:text-5xl font-bold mb-4">
        Enter Your Name & Age
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-[90%] md:w-80 bg-sky-300 p-4 rounded-md"
      >
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="number"
          name="age"
          placeholder="Enter Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
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
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="number"
            value={edit.age}
            onChange={(e) => setEdit({ ...edit, age: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Update
          </button>
        </form>
      )}

      <div className="my-4 w-[90%] md:w-80 overflow-auto">
        {ls.map((item) => (
          <div
            key={item.id}
            className="flex justify-between bg-white p-2 my-2 rounded-md shadow-md"
          >
            <div>
              <p className="font-bold">{item.name}</p>
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
                className="bg-green-400 p-1 rounded text-white hover:bg-green-500"
              >
                Edit
              </button>
              <button
                onClick={() => deleteData(item.id)}
                className="bg-red-500 p-1 rounded text-white hover:bg-red-600"
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
