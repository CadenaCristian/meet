import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { collection, addDoc, updateDoc, doc } from "@firebase/firestore";
import { firestore } from "../../../../firebase_setup/firebase";
import { globalAlert } from "../../../../utils/common/functions";
import { TYPES } from "../../../../utils/common/enums";
export default function UserModal({ id, userData, modal, rol, }) {
    const ref = collection(firestore, "users");
    const [buttonSpinner, setButtonSpinner] = React.useState(false);
    const [modalFunction, setModalFunction] = React.useState("add");
    const [modalState, setModalState] = React.useState("");
    const [dataUserForm, setDataUserForm] = React.useState({
        fullName: "",
        nickName: "",
        email1: "",
        email2: "",
        apartment: "",
        vote: false,
        coefficient: null || 0,
    });
    const { fullName, nickName, email1, email2, apartment, vote, coefficient } = dataUserForm;
    const dataUser = ({ target }) => {
        setDataUserForm({
            ...dataUserForm,
            [target.name]: target.value,
        });
    };
    const valData = () => {
        if (fullName.length < 1) {
            return true;
        }
        else if (email1.length < 1) {
            return true;
        }
        else if (email2.length < 1) {
            return true;
        }
        else if (dataUserForm.fullName === userData?.userData?.fullName &&
            dataUserForm.email1 === userData?.userData?.email1 &&
            dataUserForm.email2 === userData?.userData?.email2 &&
            dataUserForm.apartment === userData?.userData?.apartment &&
            dataUserForm.vote === userData?.userData?.vote &&
            dataUserForm.coefficient === userData?.userData?.coefficient) {
            return true;
        }
        else if (rol == "Seleccione un rol") {
            return true;
        }
        else {
            return false;
        }
    };
    const clearForm = () => {
        setDataUserForm({
            fullName: "",
            nickName: "",
            email1: "",
            email2: "",
            apartment: "",
            vote: false,
            coefficient: 0,
        });
        setModalFunction("add");
    };
    const addUser = async () => {
        setButtonSpinner(true);
        try {
            let obj = dataUserForm;
            obj.rol = rol;
            await addDoc(ref, {
                complexId: id,
                userData: obj,
            });
        }
        catch (error) {
            globalAlert(TYPES.ERROR, "Insertar", `${error}`, 2000);
        }
        clearForm();
        setModalState("");
        setButtonSpinner(false);
    };
    const updateUser = async () => {
        setButtonSpinner(true);
        try {
            await updateDoc(doc(firestore, "users", userData?.id), {
                userData: dataUserForm,
            });
        }
        catch (error) {
            globalAlert(TYPES.ERROR, "Actualizar", `${error}`, 2000);
        }
        clearForm();
        setModalState("");
        setButtonSpinner(false);
    };
    React.useEffect(() => {
        setModalState(modal);
        if (userData != undefined) {
            setDataUserForm({
                ...dataUserForm,
                fullName: userData?.userData?.fullName,
                nickName: userData?.userData?.nickName,
                email1: userData?.userData?.email1,
                email2: userData?.userData?.email2,
                apartment: userData?.userData?.apartment,
                vote: userData?.userData?.vote,
                coefficient: userData?.userData?.coefficient,
            });
            setModalFunction("update");
        }
    }, [userData]);
    return (<div className="container-fluid">
      <div className="row justify-content-center">
        <button type="button" className="col-2 btn btn-success btn-sm" disabled={id === ""} onClick={() => {
            clearForm();
            setModalState("show");
            setModalFunction("add");
        }}>
          <FontAwesomeIcon icon={faPlusCircle}/>
        </button>
      </div>

      {/* // Modal */}
      <div className={`modal fade ${modalState}`} style={{ opacity: 1 }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setModalState("")}></button>
            </div>
            <div className="modal-body">
              <div className="row text-center">
                <label className={`fs-5 fw-lighter`}>Datos del usuario</label>
              </div>
              <div className="row justify-content-between align-items-start py-1">
                <div className="col-12 col-md-6 ps-0">
                  <label className="label-form px-0 mx-0">
                    Nombre completo
                  </label>
                  <input id="fullName" name="fullName" type="text" className="form-control" value={fullName.toLocaleLowerCase()} onChange={(e) => dataUser(e)}/>
                </div>
                <div className="col-12 col-md-6 pe-0">
                  <label className="label-form px-0 mx-0">Nickname</label>
                  <input id="nickName" name="nickName" type="text" className="form-control" value={nickName.toLocaleLowerCase()} onChange={(e) => dataUser(e)}/>
                </div>
              </div>
              <div className="row align-items-start py-1">
                <div className="col-12 col-md-6 ps-0">
                  <label className="label-form px-0 mx-0">Correo N°1</label>
                  <input id="email1" name="email1" type="email" className="form-control" value={email1} onChange={(e) => dataUser(e)}/>
                </div>
                <div className="col-12 col-md-6 pe-0">
                  <label className="label-form px-0 mx-0">Correo N°2</label>
                  <input id="email2" name="email2" type="email" className="form-control" value={email2} onChange={(e) => dataUser(e)}/>
                </div>
              </div>
              <div className="row justify-content-between align-items-start py-1">
                <div className="col-12 col-md-4 ps-0">
                  <label className="form-check-label">N° Apartamento</label>
                  <input id="apartment" name="apartment" type="text" className="form-control" value={apartment.toLocaleLowerCase()} onChange={(e) => dataUser(e)}/>
                </div>
                <div className="col-12 col-md-4">
                  <label className="col-12 label-form text-center">
                    ¿Puede votar?
                  </label>
                  <div className="d-flex justify-content-around align-items-start py-1">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" id="vote" name="vote" checked={vote === false ? false : true} onChange={() => setDataUserForm({
            ...dataUserForm,
            vote: true,
        })}/>
                      <label className="form-check-label">Si</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" id="vote" name="vote" checked={vote === false ? true : false} onChange={() => setDataUserForm({
            ...dataUserForm,
            vote: false,
        })}/>
                      <label className="form-check-label">No</label>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-4 pe-0">
                  <label className="form-check-label">Coeficiente</label>
                  <input id="coefficient" name="coefficient" type="number" className="form-control" value={coefficient} onChange={(e) => dataUser(e)}/>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={() => {
            clearForm();
            setModalState("");
        }}>
                Cerrar
              </button>
              {!buttonSpinner ? (<button type="button" className={`col-3 btn btn-${modalFunction === "update" ? "warning" : "success"} btn-sm`} onClick={() => modalFunction === "update" ? updateUser() : addUser()} disabled={valData()}>
                  {modalFunction === "update" ? "Actualizar" : "Agregar"}
                </button>) : (<button type="button" className={`col-3 btn btn-primary`} disabled={valData()}>
                  <span role="status" aria-hidden="true" className="spinner-border spinner-border-sm"/>
                  <span className="visually ps-1">Cargando...</span>
                </button>)}
            </div>
          </div>
        </div>
      </div>
    </div>);
}
