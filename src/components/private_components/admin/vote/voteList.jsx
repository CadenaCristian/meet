import React from "react";
import { onSnapshot, collection, query, where, doc, deleteDoc, updateDoc } from "firebase/firestore";
import VoteModal from "./VoteModal";
import { firestore } from "../../../../firebase_setup/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { globalAlert } from "../../../../utils/common/functions";
import { TYPES } from "../../../../utils/common/enums";
import votes from "../../../../styles/votes.module.css";
import global from "../../../../styles/global.module.css";
export default function VoteList({ id, name }) {
    const collectionRef = collection(firestore, "questions");
    const [dataAnswers, setDataAnswers] = React.useState();
    const [modal, setModal] = React.useState("");
    const [allQestions, setAllQuestions] = React.useState([]);
    const getAllQuestionsByComplex = () => {
        const q = query(collectionRef, where("complexId", "==", id));
        const unsub = onSnapshot(q, (querySnapshot) => {
            let todosArray = [];
            querySnapshot.forEach((doc) => {
                todosArray.push({ ...doc.data(), id: doc.id });
            });
            if (todosArray.length > 0) {
                todosArray.sort((a, b) => a.question.localeCompare(b.question, "en", { numeric: true }));
                setAllQuestions(todosArray);
            }
            else {
                setAllQuestions([]);
            }
        });
        return () => unsub();
    };
    const deleteQuestion = async (id) => {
        try {
            const resp = await deleteDoc(doc(firestore, "questions", id));
        }
        catch (error) {
            globalAlert(TYPES.ERROR, "Delete", error, 2000);
        }
    };
    const chageStatusQuestion = async (id, status) => {
        try {
            await updateDoc(doc(firestore, "questions", id), {
                status: status,
            });
        }
        catch (error) {
            globalAlert(TYPES.ERROR, "Actualizar", `${error}`, 2000);
        }
    };
    const resetQuestion = async (id) => {
        try {
            await updateDoc(doc(firestore, "questions", id), {
                userAnswers: [],
            });
        }
        catch (error) {
            globalAlert(TYPES.ERROR, "Actualizar", `${error}`, 2000);
        }
    };
    React.useEffect(() => {
        getAllQuestionsByComplex();
    }, [id]);
    return (<div className={`container-fluid py-2 ${votes.acordionContainer}`}>
      <div className="row justify-content-center">
        <VoteModal id={id} dataAnswers={dataAnswers} modal={modal}/>
      </div>
      <div className="row pt-1">
        <p className={`${votes.complexName}`}>Conjunto: {name}</p>
      </div>
      <div className="row py-2 justify-content-center" hidden={id !== ""}>
        <div className="alert alert-info" role="alert">
          Seleccione un conjunto en la tabla de la izquierda
        </div>
      </div>
      <div className="row py-2 justify-content-center" hidden={id === "" || allQestions.length > 0}>
        <div className="alert alert-info" role="alert">
          Agregué una pregunta
        </div>
      </div>

      {/* Acordion */}
      <div hidden={allQestions.length === 0}>
        {allQestions &&
            allQestions.map((pos, index) => {
                return (<div key={index} className="accordion" id={`accordion${index}`}>
                <div className="accordion-item">
                  <h2 className="accordion-header" id={`heading${index}`}>
                    <button className={`${votes.accordionHeader} accordion-button collapsed`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="false" aria-controls={`collapse${index}`}>
                      {pos?.question}
                    </button>
                  </h2>
                  <div id={`collapse${index}`} className="accordion-collapse collapse" aria-labelledby={`heading${index}`} data-bs-parent={`#accordion${index}`}>
                    <div className="accordion-body">
                      <div className="col-12 d-flex justify-content-between pb-2">
                        <div className="col-6 py-3 d-flex justify-content-start">
                          <button id={pos?.id} type="button" className="col-4 btn btn-outline-warning btn-sm" onClick={() => {
                        setDataAnswers(pos);
                        setModal("show");
                    }}>
                            <FontAwesomeIcon icon={faEdit}/>
                          </button>
                          <button id={pos?.id} type="button" className="col-4 btn btn-outline-danger btn-sm" onClick={() => deleteQuestion(pos?.id)}>
                            <FontAwesomeIcon icon={faTrash}/>
                          </button>
                          <button type="button" className="col-4 btn btn-outline-primary btn-sm" onClick={() => resetQuestion(pos?.id)}>
                            <FontAwesomeIcon icon={faArrowsRotate}/>
                          </button>
                        </div>
                        <div className="col-4 py-3 d-flex justify-content-end">
                          <div className="d-flex justify-content-around">
                            <label className={`${global.label} ${votes.switchLabels} px-2 fw-lighter`}>
                              Inactivo
                            </label>
                            <div className="form-switch">
                              <input className="form-check-input" type="checkbox" role="switch" checked={pos?.status} id="flexSwitchCheckDefault" onChange={(e) => chageStatusQuestion(pos?.id, e.target.checked)}/>
                            </div>
                            <label className={`${global.label} ${votes.switchLabels} px-2 fw-lighter`}>
                              Activo
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr className={`${global.theadSizeFont} text-center table-dark`}>
                                <th scope="col">Respuestas</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pos?.answers?.map((elem, answerIndex) => {
                        return (<tr key={answerIndex}>
                                      <td className={`text-center align-middle ${global.theadSizeFont}`}>
                                        {elem?.text}
                                      </td>
                                    </tr>);
                    })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>);
            })}
      </div>
    </div>);
}
