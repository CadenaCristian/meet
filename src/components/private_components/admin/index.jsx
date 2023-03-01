import React, { useEffect } from "react";
import { collection, query, onSnapshot, } from "@firebase/firestore";
import { firestore } from "../../../firebase_setup/firebase";
import Sidebar from "./Sidebar";
export default function Index({ children }) {
    useEffect(() => {
        (() => {
            let todosArray = [];
            const q = query(collection(firestore, "usuarios"));
            onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    todosArray.push({ ...doc.data(), id: doc.id });
                });
            });
        })();
    }, []);
    return (<>
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <Sidebar />
          <div className="col py-1">
            <div className="row justify-content-between">
              <> {children} </>
            </div>
          </div>
        </div>
      </div>
    </>);
}
