import React from "react";
import { query, collection, onSnapshot } from "@firebase/firestore";
import { faEye, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { firestore } from "../../../../firebase_setup/firebase";
import UserListBycomplex from "./userListBycomplex";
export default function User() {
    const navigate = useNavigate();
    const [id, setId] = React.useState("");
    const [nameComplex, setNameComplex] = React.useState("");
    const [spinner, setSpinner] = React.useState(true);
    const [allComplexData, setAllComplexData] = React.useState([]);
    const getAllComplex = () => {
        const q = query(collection(firestore, "complex"));
        const unsub = onSnapshot(q, (querySnapshot) => {
            let todosArray = [];
            querySnapshot.forEach((doc) => {
                todosArray.push({ ...doc.data(), id: doc.id });
            });
            if (todosArray.length > 0)
                setAllComplexData(todosArray);
        });
        setSpinner(false);
        return () => unsub();
    };
    React.useEffect(() => {
        getAllComplex();
    }, []);
    return (<div className="container">
      <div className="row justify-content-between">
        <div className="col-12 col-md-4">
          {spinner ? (<div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>) : allComplexData.length > 0 ? (<div className="table-responsive overflow-auto">
              <table className="table text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Nombre completo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {allComplexData.map((pos, index) => {
                return (<tr key={index}>
                        <td className="">{pos?.name}</td>
                        <td className="d-flex justify-content-around">
                          <button id={pos?.id} type="button" className="btn btn-primary btn-sm" onClick={() => {
                        setId(pos?.id);
                        setNameComplex(pos?.name);
                    }}>
                            <FontAwesomeIcon icon={faEye}/>
                          </button>
                        </td>
                      </tr>);
            })}
                </tbody>
              </table>
            </div>) : (<div className="row justify-content-center">
              <div className="col-12 alert alert-info" role="alert">
                No hay conjuntos por el momento
              </div>
              <button type="button" className="d-flex justify-content-around align-items-center col-12 col-md-4 btn btn-primary">
                <p className="p-0 m-0">Agregar conjunto</p>
                <FontAwesomeIcon icon={faPlusCircle}/>
              </button>
            </div>)}
        </div>
        <div className="col-12 col-md-8 px-0">
          <UserListBycomplex id={id} name={nameComplex}/>
        </div>
      </div>
    </div>);
}
