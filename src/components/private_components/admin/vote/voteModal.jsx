import React from "react";
import { collection, addDoc, updateDoc, doc, } from "@firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faPlusCircle, faTrash, } from "@fortawesome/free-solid-svg-icons";
import { firestore } from "../../../../firebase_setup/firebase";
import { globalAlert } from "../../../../utils/common/functions";
import { TYPES } from "../../../../utils/common/enums";
export default function VoteModal({ id, dataAnswers, modal }) {
    const [modalFunction, setModalFunction] = React.useState("success");
    const [modalState, setModalState] = React.useState("");
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
    };
    const addQuestion = async () => {
        const ref = collection(firestore, "questions");
        try {
            let resp = await addDoc(ref, {
                complexId: id,
                question: question,
                answers: answers,
            });
            console.log(resp);
        }
        catch (error) {
            globalAlert(TYPES.ERROR, "Insertar", `${error}`);
        }
        setModalState("");
        clearForm();
    };
    const updateQuestion = async () => {
        await updateDoc(doc(firestore, "questions", dataAnswers?.id), {
            question: question,
            answers: answers
        });
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
        if (answers === dataAnswers?.answers && question === dataAnswers?.question) {
            return true;
        }
        else if (answers.length < 1 || question.length < 1) {
            return true;
        }
        else {
            return false;
        }
    };
    React.useEffect(() => {
        // console.log("dataAnswers: ", dataAnswers);
        setAnswers(dataAnswers?.answers);
        setQuestion(dataAnswers?.question);
        setModalState(modal);
        setModalFunction("warning");
    }, [dataAnswers]);
    console.log("dataAnswers: ", dataAnswers);
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
              <label className="fs-6 fw-lighter">Pregunta</label>
              <div className="row align-items-center py-1">
                <div className="col-10">
                  <input id="question" name="question" className="form-control" value={question} onChange={(e) => setQuestion(e.target.value)}/>
                </div>
                <div className="col-2">
                  <button type="button" className="col-12 btn btn-primary" disabled={!question} onClick={() => setQuestion("")}>
                    <FontAwesomeIcon icon={faBroom}/>
                  </button>
                </div>
              </div>
              <label className="fs-6 fw-lighter">Respuestas</label>
              {answers && answers.map((item, index) => {
            return (<div key={index} className="row align-items-center py-1">
                    <div className="col-10">
                      <input type="text" className="form-control" value={answers[index].text} onChange={(e) => editObj(e, index)}/>
                    </div>
                    <div className="col-2">
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
