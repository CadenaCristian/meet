import React from "react";
import { query, collection, onSnapshot, } from "@firebase/firestore";
import { firestore } from "../../../../firebase_setup/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import VoteList from "./voteList";
export default function Vote() {
    const navigate = useNavigate();
    const [id, setId] = React.useState("");
    const [nameComplex, setNameComplex] = React.useState("");
    const [spinner, setSpinner] = React.useState(true);
    const [allVotesData, setAllVotesData] = React.useState([]);
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
    const getAllVotes = () => {
        const q = query(collection(firestore, "vote"));
        const unsub = onSnapshot(q, (querySnapshot) => {
            let allArray = [];
            querySnapshot.forEach((doc) => {
                allArray.push({ ...doc.data(), id: doc.id });
            });
            if (allArray.length > 0)
                setAllVotesData(allArray);
        });
        setSpinner(false);
        return () => unsub();
    };
    React.useEffect(() => {
        getAllComplex();
        getAllVotes();
    }, []);
    return (<div className="container">
      <div className="row justify-content-between">
        <div className="col-12 col-md-6">
          {spinner ? (<div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>) : allComplexData.length > 0 ? (<table className="table table-responsive">
              <thead className="table-dark">
                <tr>
                  <th>Nombre del conjunto</th>
                  <th>Dirección del conjunto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {allComplexData.map((pos, index) => {
                return (<tr key={index}>
                      <td className="">{pos?.name}</td>
                      <td className="">{pos?.address}</td>
                      <td className="d-flex justify-content-around">
                        <button id={pos?.id} type="button" onClick={() => {
                        setId(pos?.id);
                        setNameComplex(pos?.name);
                    }} className="btn btn-primary btn-sm">
                          <FontAwesomeIcon icon={faEye}/>
                        </button>
                      </td>
                    </tr>);
            })}
              </tbody>
            </table>) : (<div className="row justify-content-center">
              <div className="col-12 alert alert-info" role="alert">
                No hay conjuntos por el momento
              </div>
              <button type="button" className="d-flex justify-content-around align-items-center col-12 col-md-4 btn btn-primary" onClick={() => navigate("/admin/dashboard/complex")}>
                <p className="p-0 m-0">Agregar conjunto</p>
                <FontAwesomeIcon icon={faPlusCircle}/>
              </button>
            </div>)}
        </div>
        <div className="col-12 col-md-6">
            <VoteList id={id} name={nameComplex}/>
        </div>
      </div>
    </div>);
}
