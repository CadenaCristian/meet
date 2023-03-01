import { query, collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, } from "@firebase/firestore";
import React from "react";
import { firestore } from "../../../../firebase_setup/firebase";
import { TYPES } from "../../../../utils/common/enums";
import { deleteAlert, deleteMassive, globalAlert } from "../../../../utils/common/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import global from "../../../../styles/global.module.css";
export default function Complex() {
    const [id, setId] = React.useState("");
    const [spinner, setSpinner] = React.useState(true);
    const [buttonSpinner, setButtonSpinner] = React.useState(false);
    const [allComplexData, setAllComplexData] = React.useState([]);
    const [copyComplexData, setCopyComplexData] = React.useState("");
    const [complexData, setComplexData] = React.useState({
        name: "",
        address: "",
        linkMeeting: "",
    });
    const { name, address, linkMeeting } = complexData;
    const setDataForm = ({ target }) => {
        setComplexData({
            ...complexData,
            [target.name]: target.value,
        });
    };
    const clearForm = () => {
        setId("");
        setCopyComplexData("");
        setComplexData({
            name: "",
            address: "",
            linkMeeting: "",
        });
    };
    const getAllComplex = () => {
        const q = query(collection(firestore, "complex"));
        const unsub = onSnapshot(q, (querySnapshot) => {
            let todosArray = [];
            querySnapshot.forEach((doc) => {
                todosArray.push({ ...doc.data(), id: doc.id });
            });
            if (todosArray.length > 0) {
                todosArray.sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true }));
                setAllComplexData(todosArray);
            }
            else {
                setAllComplexData([]);
            }
        });
        setSpinner(false);
        return () => unsub();
    };
    const addComplex = async () => {
        setButtonSpinner(true);
        const ref = collection(firestore, "complex");
        try {
            await addDoc(ref, complexData);
            getAllComplex();
        }
        catch (error) {
            globalAlert(TYPES.ERROR, "Insertar", `${error}`, 2000);
        }
        clearForm();
        setButtonSpinner(false);
    };
    const getDataEdit = async (data) => {
        setCopyComplexData(data);
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
        const resp = await deleteAlert();
        if (resp) {
            try {
                await deleteMassive(id, "users", "complexId");
                await deleteMassive(id, "questions", "complexId");
                await deleteDoc(doc(firestore, "complex", id));
                globalAlert(TYPES.SUCCESS, "Eliminar", "Conjunto eliminado", 2000);
                getAllComplex();
            }
            catch (error) {
                globalAlert(TYPES.ERROR, "Eliminar", "Error al eliminar el conjunto", 2000);
            }
        }
    };
    const valData = () => {
        if (name.length < 1 || address.length < 1) {
            return true;
        }
        else if (complexData.name === copyComplexData?.name &&
            complexData.address === copyComplexData?.address) {
            return true;
        }
        else {
            return false;
        }
    };
    React.useEffect(() => {
        getAllComplex();
    }, []);
    return (<div className="container">
      <div className="row justify-content-between">
        <div className={`col-12 col-md-6 text-center ${global.tableContainer}`}>
          {spinner ? (<div className="row justify-content-center col-12">
              <div className="spinner-border text-primary" role="status"></div>
            </div>) : allComplexData.length > 0 ? (<table className="table table-responsive table-hover">
              <thead className="table-dark">
                <tr>
                  <th className={`text-center ${global.theadSizeFont}`}>
                    Nombre del conjunto
                  </th>
                  <th className={`text-center ${global.theadSizeFont}`}>
                    Dirección del conjunto
                  </th>
                  <th className={`text-center ${global.theadSizeFont}`}>
                    Link de la reunión
                  </th>
                  <th className={`text-center ${global.theadSizeFont}`}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {allComplexData.map((pos, index) => {
                return (<tr key={index}>
                      <td className={`text-center align-middle ${global.theadSizeFont}`}>
                        {pos?.name}
                      </td>
                      <td className={`text-center align-middle ${global.theadSizeFont}`}>
                        {pos?.address}
                      </td>
                      <td className={`text-center align-middle ${global.theadSizeFont}`}>
                        <CopyToClipboard text={pos?.linkMeeting}>
                          <button type="button" className="btn btn-outline-primary btn-sm py-0 px-1">
                            <FontAwesomeIcon icon={faCopy}/>
                          </button>
                        </CopyToClipboard>
                      </td>
                      <td className="d-flex justify-content-around">
                        <button id={pos?.id} type="button" onClick={() => getDataEdit(pos)} className="btn btn-outline-warning btn-sm py-0 px-1">
                          <FontAwesomeIcon icon={faEdit}/>
                        </button>
                        <button id={pos?.id} type="button" onClick={() => deleteComplex(pos?.id)} className="btn btn-outline-danger btn-sm py-0 px-1">
                          <FontAwesomeIcon icon={faTrash}/>
                        </button>
                      </td>
                    </tr>);
            })}
              </tbody>
            </table>) : (<div className="col-12 col-md-6 offset-md-3 alert alert-info" role="alert">
              No hay conjuntos por el momento, ingresa el primero!
            </div>)}
        </div>
        <div className="col-12 col-md-6">
          <form>
            <div className="mb-3">
              <label className={`${global.label} form-label`}>
                Nombre del conjunto
              </label>
              <input id="name" name="name" type="text" value={name.toUpperCase()} className="form-control" onChange={(e) => setDataForm(e)}/>
            </div>
            <div className="mb-3">
              <label className={`${global.label} form-label`}>
                Dirección del conjunto
              </label>
              <input id="address" name="address" type="text" value={address.toUpperCase()} className="form-control" onChange={(e) => setDataForm(e)}/>
            </div>
            <div className="mb-3">
              <label className={`${global.label} form-label`}>
                Link de la reunión
              </label>
              <input id="linkMeeting" name="linkMeeting" type="text" value={linkMeeting} className="form-control" onChange={(e) => setDataForm(e)}/>
            </div>
            <div className="row justify-content-around">
              {!buttonSpinner ? (<button type="button" className={`${global.buttonTextSizeFont} col-3 btn btn-${id ? "warning" : "success"} btn-sm`} onClick={() => (id ? updateComplex() : addComplex())} disabled={valData()}>
                  {id ? "Actualizar" : "Agregar"}
                </button>) : (<button type="button" className={`${global.buttonTextSizeFont} col-3 btn btn-primary`} disabled={valData()}>
                  <span role="status" aria-hidden="true" className="spinner-border spinner-border-sm"/>
                  <span className="visually ps-1">Cargando...</span>
                </button>)}
              <button type="button" className={`${global.buttonTextSizeFont} col-3 btn btn-danger btn-sm`} onClick={() => clearForm()}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>);
}
