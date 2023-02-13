import React, { useEffect, useState } from "react";
import { addDoc, collection, query, onSnapshot, } from "@firebase/firestore";
import { firestore } from "../../../firebase_setup/firebase";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
export default function Index({ children }) {
    const [userData, setUserData] = useState({
        name: "",
        lastName: "",
    });
    const { name, lastName } = userData;
    const navigate = useNavigate();
    const nav = () => navigate("/meetings");
    const handleSubmit = (testdata) => {
        const ref = collection(firestore, "usuarios"); // Firebase creates this automatically
        let data = {
            testData: testdata,
        };
        try {
            addDoc(ref, data);
        }
        catch (err) {
            console.log(err);
        }
    };
    const setData = ({ target }) => {
        setUserData({
            ...userData,
            [target.name]: target.value,
        });
    };
    const addData = () => {
        handleSubmit(userData);
    };
    useEffect(() => {
        (() => {
            let todosArray = [];
            const q = query(collection(firestore, "usuarios"));
            onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    todosArray.push({ ...doc.data(), id: doc.id });
                });
            });
            console.log("todosArray: ", todosArray);
        })();
    }, []);
    return (<>
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <Sidebar />
          <div className="col py-1">
            <div className="row justify-content-center">
              <> {children} </>
            </div>
          </div>
        </div>
      </div>
    </>);
}
