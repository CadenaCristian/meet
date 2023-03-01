import React from "react";
import { onSnapshot, collection, query, where, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../../../firebase_setup/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import UserModal from "./UserModal";
import global from "../../../../styles/global.module.css";
import { globalAlert } from "../../../../utils/common/functions";
import { TYPES } from "../../../../utils/common/enums";
export default function UserListBycomplex({ id, name, rol }) {
    const collectionRef = collection(firestore, "users");
    const [dataUsers, setDataUsers] = React.useState();
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
    const deleteUser = async (id) => {
        try {
            const resp = await deleteDoc(doc(firestore, "users", id));
        }
        catch (error) {
            globalAlert(TYPES.ERROR, "Delete", error, 2000);
        }
    };
    React.useEffect(() => {
        getAllUsersByComplex();
    }, [id]);
    return (<div className="container px-0">
      <div className="row justify-content-center">
        <UserModal id={id} userData={dataUsers} modal={modal} rol={rol}/>
      </div>
      <div className="row pt-1">
        <p className={`${global.complexName}`}>
          {rol === "user" ? `Conjunto: ${name}` : `${name.toUpperCase()}`}
        </p>
      </div>
      <div className="row col-12 py-2 justify-content-center" hidden={id !== ""}>
        <div className="col-6 alert alert-info" role="alert">
          Seleccione un conjunto en la tabla de la izquierda
        </div>
      </div>
      <div className="row col-12 py-2 justify-content-center" hidden={id === "" || allUsers.length > 0}>
        <div className="col-6 alert alert-info" role="alert">
          Agregué un usuario
        </div>
      </div>

      <div className="table-responsive overflow-auto p-2" hidden={allUsers.length === 0}>
        <table className="table table-hover">
          <thead className="text-center table-dark">
            <tr>
              <th className={`${global.theadSizeFont}`}>Nombre completo</th>
              <th className={`${global.theadSizeFont}`}>Nickname</th>
              <th className={`${global.theadSizeFont}`}>Email principal</th>
              <th className={`${global.theadSizeFont}`}>Email secundario</th>
              <th className={`${global.theadSizeFont}`}>Coeficiente</th>
              <th className={`${global.theadSizeFont}`}>¿Puede votar?</th>
              <th className={`${global.theadSizeFont}`}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {allUsers &&
            allUsers.map((pos, index) => {
                return (<tr key={index}>
                    <td className={`text-center align-middle ${global.theadSizeFont}`}>{pos?.userData?.fullName.toUpperCase()}</td>
                    <td className={`text-center align-middle ${global.theadSizeFont}`}>{pos?.userData?.nickName.toUpperCase()}</td>
                    <td className={`text-center align-middle ${global.theadSizeFont}`}>{pos?.userData?.email1.toLocaleLowerCase()}</td>
                    <td className={`text-center align-middle ${global.theadSizeFont}`}>{pos?.userData?.email2.toLocaleLowerCase()}</td>
                    <td className={`text-center align-middle ${global.theadSizeFont}`}>
                      {pos?.userData?.coefficient}
                    </td>
                    <td className={`text-center align-middle ${global.theadSizeFont}`}>
                      {pos?.userData?.vote === true ? "Si" : "No"}
                    </td>
                    <td className="d-flex justify-content-between">
                      <button type="button" className="btn btn-warning btn-sm py-0 px-1" onClick={() => {
                        setDataUsers(pos);
                        setModal("show");
                    }}>
                        <FontAwesomeIcon icon={faPencil}/>
                      </button>
                      <button id={pos?.id} type="button" onClick={() => deleteUser(pos?.id)} className="btn btn-danger btn-sm py-0 px-1">
                        <FontAwesomeIcon icon={faTrash}/>
                      </button>
                    </td>
                  </tr>);
            })}
          </tbody>
        </table>
      </div>
    </div>);
}
