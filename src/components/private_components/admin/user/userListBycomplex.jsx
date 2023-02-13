import React from "react";
import { onSnapshot, collection, query, where, } from "firebase/firestore";
import { firestore } from "../../../../firebase_setup/firebase";
import UserModal from "./userModal";
export default function UserListBycomplex({ id, name, }) {
    const collectionRef = collection(firestore, "users");
    const [dataAnswers, setDataAnswers] = React.useState();
    const [modal, setModal] = React.useState("");
    const [allUsers, setAllUsers] = React.useState([]);
    const getAllUsersByComplex = () => {
        const q = query(collectionRef, where("complexId", "==", id));
        const unsub = onSnapshot(q, (querySnapshot) => {
            let todosArray = [];
            querySnapshot.forEach((doc) => {
                todosArray.push({ ...doc.data(), id: doc.id });
            });
            if (todosArray.length > 0) {
                setAllUsers(todosArray);
            }
            else {
                setAllUsers([]);
            }
        });
        return () => unsub();
    };
    React.useEffect(() => {
        getAllUsersByComplex();
    }, [id]);
    return (<div className="container px-0">
      <div className="row justify-content-center">
        <UserModal id={id} userData={dataAnswers} modal={modal}/>
      </div>
      <div className="row p-2 justify-content-center">
        <h5>Conjunto: {name}</h5>
      </div>
      <div className="row col-12 py-2 justify-content-center" hidden={id !== ""}>
        <div className="col-8 alert alert-info" role="alert">
          Seleccione un conjunto en la tabla de la izquierda
        </div>
      </div>
      <div className="row col-12 py-2 justify-content-center" hidden={id === "" || allUsers.length > 0}>
        <div className="col-8 alert alert-info" role="alert">
          Agregué un usuario
        </div>
      </div>

      <div className="table-responsive overflow-auto p-2" hidden={allUsers.length === 0}>
        <table className="table">
          <thead className="table-dark">
            <tr>
              <th className="text-center">Nombre completo</th>
              <th className="text-center">Email principal</th>
              <th className="text-center">Email secundario</th>
              <th className="text-center">Coeficiente</th>
              <th className="text-center">¿Puede votar?</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {allUsers && allUsers.map((pos, index) => {
            return (<tr key={index}>
                  <td className="text-center">{pos?.userData?.fullName}</td>
                  <td className="text-center">{pos?.userData?.email1}</td>
                  <td className="text-center">{pos?.userData?.email2}</td>
                  <td className="text-center">{pos?.userData?.coefficient}</td>
                  <td className="text-center">{pos?.userData?.vote === true ? "Si" : "No"}</td>
                </tr>);
        })}
          </tbody>
        </table>
      </div>
    </div>);
}
