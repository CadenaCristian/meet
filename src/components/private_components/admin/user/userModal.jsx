import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { collection, addDoc, } from "@firebase/firestore";
import { firestore } from "../../../../firebase_setup/firebase";
import { globalAlert } from "../../../../utils/common/functions";
import { TYPES } from "../../../../utils/common/enums";
export default function UserModal({ id, userData, modal, }) {
    const [modalFunction, setModalFunction] = React.useState("success");
    const [modalState, setModalState] = React.useState("");
    const [dataUserForm, setDataUserForm] = React.useState({
        fullName: "",
        email1: "",
        email2: "",
        vote: false,
        coefficient: null || 0,
    });
    const { fullName, email1, email2, vote, coefficient } = dataUserForm;
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
    };
    const clearForm = () => {
        setDataUserForm({
            fullName: "",
            email1: "",
            email2: "",
            vote: false,
            coefficient: 0,
        });
    };
    const addUser = async () => {
        const ref = collection(firestore, "users");
        try {
            let resp = await addDoc(ref, {
                complexId: id,
                userData: dataUserForm
            });
            console.log(resp);
        }
        catch (error) {
            globalAlert(TYPES.ERROR, "Insertar", `${error}`);
        }
        setModalState("");
        clearForm();
    };
    const updateUser = () => {
    };
    console.log("dataUserForm: ", dataUserForm);
    return (<div className="container-fluid">
      <div className="row justify-content-center">
        <button type="button" className="col-2 btn btn-success btn-sm" disabled={id === ""} onClick={() => {
            // clearForm()
            setModalState("show");
            setModalFunction("success");
        }}>
          <FontAwesomeIcon icon={faPlusCircle}/>
        </button>
      </div>

      {/* // Modal */}
      <div className={`modal fade ${modalState}`} style={{ opacity: 1 }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setModalState("")}></button>
            </div>
            <div className="modal-body">
              <div className="row text-center">
                <label className="fs-6 fw-lighter">Datos del usuario</label>
              </div>
              <div className="row align-items-start py-1">
                <label className="label-form px-0 mx-0">Nombre completo</label>
                <input id="fullName" name="fullName" type="text" className="form-control" value={fullName.toUpperCase()} onChange={(e) => dataUser(e)}/>
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
                <div className="col-12 col-md-6">
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
                <div className="col-12 col-md-6">
                  <label className="form-check-label">Coeficiente</label>
                  <input id="coefficient" name="coefficient" type="number" className="form-control" value={coefficient} onChange={(e) => dataUser(e)}/>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={() => {
            // clearForm()
            setModalState("");
        }}>
                Cerrar
              </button>
              <button type="button" className={`btn btn-${modalFunction}`} onClick={() => {
            modalFunction === "warning"
                ? updateUser()
                : addUser();
        }} disabled={valData()}>
                {modalFunction === "warning" ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
