import { query, collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from "@firebase/firestore";
import React from "react";
import { firestore } from "../../../../firebase_setup/firebase";
import { TYPES } from "../../../../utils/common/enums";
import { globalAlert } from "../../../../utils/common/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
export default function Complex() {
    const [id, setId] = React.useState("");
    const [spinner, setSpinner] = React.useState(true);
    const [buttonSpinner, setButtonSpinner] = React.useState(false);
    const [allComplexData, setAllComplexData] = React.useState([]);
    const [complexData, setComplexData] = React.useState({
        name: "",
        address: "",
    });
    const { name, address } = complexData;
    const setDataForm = ({ target }) => {
        setComplexData({
            ...complexData,
            [target.name]: target.value,
        });
    };
    const clearForm = () => {
        setId("");
        setComplexData({
            name: "",
            address: "",
        });
    };
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
    const addComplex = async () => {
        setButtonSpinner(true);
        const ref = collection(firestore, "complex");
        try {
            let resp = await addDoc(ref, complexData);
            console.log(resp);
            getAllComplex();
        }
        catch (error) {
            globalAlert(TYPES.ERROR, "Insertar", `${error}`);
        }
        clearForm();
        setButtonSpinner(false);
    };
    const getDataEdit = async (data) => {
        setComplexData({
            ...complexData,
            name: data?.name,
            address: data?.address,
        });
        setId(data?.id);
    };
    const updateComplex = async () => {
        await updateDoc(doc(firestore, "complex", id), complexData);
        clearForm();
        getAllComplex();
    };
    const deleteComplex = async (id) => {
        await deleteDoc(doc(firestore, "complex", id));
        getAllComplex();
    };
    React.useEffect(() => {
        getAllComplex();
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
                        <button id={pos?.id} type="button" onClick={() => getDataEdit(pos)} className="btn btn-outline-warning btn-sm">
                          <FontAwesomeIcon icon={faEdit}/>
                        </button>
                        <button id={pos?.id} type="button" onClick={() => deleteComplex(pos?.id)} className="btn btn-outline-danger btn-sm">
                          <FontAwesomeIcon icon={faTrash}/>
                        </button>
                      </td>
                    </tr>);
            })}
              </tbody>
            </table>) : (<div className="col-12 col-md-6 alert alert-info" role="alert">
              No hay conjuntos por el momento, ingresa el primero!
            </div>)}
        </div>
        <div className="col-12 col-md-6">
          <form>
            <div className="mb-3">
              <label className="form-label">Nombre del conjunto</label>
              <input id="name" name="name" type="text" value={name.toUpperCase()} className="form-control" onChange={(e) => setDataForm(e)}/>
            </div>
            <div className="mb-3">
              <label className="form-label">Dirección del conjunto</label>
              <input id="address" name="address" type="text" value={address.toUpperCase()} className="form-control" onChange={(e) => setDataForm(e)}/>
            </div>
            <div className="row justify-content-around">
              {!buttonSpinner ? (<button type="button" className={`col-3 btn btn-${id ? "warning" : "success"} btn-sm`} onClick={() => id ? updateComplex() : addComplex()} disabled={name.length < 1 || address.length < 0}>
                  {id ? "Actualizar" : "Agregar"}
                </button>) : (<button className="col-3 btn btn-primary" type="button">
                  <span role="status" aria-hidden="true" className="spinner-border spinner-border-sm"/>
                  <span className="visually ps-1">Cargando...</span>
                </button>)}
              <button type="button" className={`col-3 btn btn-danger btn-sm`} onClick={() => clearForm()} disabled={name.length < 1 || address.length < 0}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>);
}
