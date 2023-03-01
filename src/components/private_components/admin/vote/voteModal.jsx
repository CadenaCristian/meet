import React from "react";
import { collection, addDoc, updateDoc, doc } from "@firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faPlusCircle, faTrash, } from "@fortawesome/free-solid-svg-icons";
import { firestore } from "../../../../firebase_setup/firebase";
import { globalAlert } from "../../../../utils/common/functions";
import { TYPES } from "../../../../utils/common/enums";
import votes from "../../../../styles/votes.module.css";
import global from "../../../../styles/global.module.css";
export default function VoteModal({ id, dataAnswers, modal, }) {
    const [modalFunction, setModalFunction] = React.useState("success");
    const [modalState, setModalState] = React.useState("");
    const [statusQuestion, setStatusQuestion] = React.useState(false);
    const [question, setQuestion] = React.useState("");
    const initialAnswer = [
        {
            text: "Si",
        },
        {
            text: "No",
        },
    ];
    const [answers, setAnswers] = React.useState(initialAnswer);
    const clearForm = () => {
        setAnswers(initialAnswer);
        setQuestion("");
        setStatusQuestion(false);
    };
    const addQuestion = async () => {
        const ref = collection(firestore, "questions");
        try {
            let resp = await addDoc(ref, {
                complexId: id,
                question: question,
                answers: answers,
                userAnswers: [],
                status: statusQuestion,
            });
        }
        catch (error) {
            globalAlert(TYPES.ERROR, "Insertar", `${error}`, 2000);
        }
        setModalState("");
        clearForm();
    };
    const updateQuestion = async () => {
        try {
            await updateDoc(doc(firestore, "questions", dataAnswers?.id), {
                question: question,
                answers: answers,
            });
        }
        catch (error) {
            globalAlert(TYPES.ERROR, "Actualizar", `${error}`, 2000);
        }
        clearForm();
        setModalState("");
        setModalFunction("success");
    };
    const addInput = () => {
        setAnswers([...answers, { text: "" }]);
    };
    const deleteInput = (index) => {
        setAnswers(answers.filter((pos, eveindex) => eveindex !== index));
    };
    const editObj = (text, index) => {
        const array = answers.map((item, indexObj) => {
            if (index === indexObj) {
                return {
                    text: text?.target?.value,
                };
            }
            return item;
        });
        setAnswers(array);
    };
    const valData = () => {
        if (answers === dataAnswers?.answers &&
            question === dataAnswers?.question) {
            return true;
        }
        else if (answers?.length < 1 || question?.length < 1) {
            return true;
        }
        else {
            return false;
        }
    };
    React.useEffect(() => {
        setAnswers(dataAnswers?.answers);
        setQuestion(dataAnswers?.question);
        setModalState(modal);
        setStatusQuestion(dataAnswers?.status);
        setModalFunction("warning");
    }, [dataAnswers]);
    return (<div className="container-fluid">
      <div className="row justify-content-center">
        <button type="button" className="col-12 col-md-2 btn btn-success btn-sm" disabled={id === ""} onClick={() => {
            clearForm();
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
              <div className="row col-5 col-md-4">
                <div className="d-flex justify-content-center">
                  <label className={`${global.label} ${votes.switchLabels} px-2 fw-lighter`}>
                    Inactivo
                  </label>
                  <div className="form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" checked={statusQuestion} id="flexSwitchCheckDefault" onChange={() => setStatusQuestion(!statusQuestion)}/>
                  </div>
                  <label className={`${global.label} ${votes.switchLabels} px-2 fw-lighter`}>
                    Activo
                  </label>
                </div>
              </div>
              <div className="row col-12">
                <label className={`${global.label} fw-lighter`}>Pregunta</label>
              </div>
              <div className="row align-items-center py-1">
                <div className="col-9 col-md-10">
                  <input id="question" name="question" className="form-control" value={question} onChange={(e) => setQuestion(e.target.value)}/>
                </div>
                <div className="col-3 col-md-2">
                  <button type="button" className="col-12 btn btn-primary" disabled={!question} onClick={() => setQuestion("")}>
                    <FontAwesomeIcon icon={faBroom}/>
                  </button>
                </div>
              </div>
              <label className={`${global.label} fw-lighter`}>Respuestas</label>
              {answers &&
            answers.map((item, index) => {
                return (<div key={index} className="row align-items-center py-1">
                      <div className="col-9 col-md-10">
                        <input type="text" className={`${votes.input} form-control`} value={answers[index].text} onChange={(e) => editObj(e, index)}/>
                      </div>
                      <div className="col-3 col-md-2">
                        <button type="button" className="col-12 btn btn-danger" onClick={() => deleteInput(index)}>
                          <FontAwesomeIcon icon={faTrash}/>
                        </button>
                      </div>
                    </div>);
            })}
              <div className="row justify-content-center py-2">
                <button type="button" className="col-12 col-md-2 btn btn-primary" onClick={() => addInput()}>
                  <FontAwesomeIcon icon={faPlusCircle}/>
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={() => {
            clearForm();
            setModalState("");
        }}>
                Cerrar
              </button>
              <button type="button" className={`btn btn-${modalFunction}`} onClick={() => {
            modalFunction === "warning"
                ? updateQuestion()
                : addQuestion();
        }} disabled={valData()}>
                {modalFunction === "warning" ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
