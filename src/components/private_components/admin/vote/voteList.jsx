import React from "react";
import { onSnapshot, collection, query, where, doc, deleteDoc } from "firebase/firestore";
import VoteModal from "./voteModal";
import { firestore } from "../../../../firebase_setup/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { globalAlert } from '../../../../utils/common/functions';
import { TYPES } from "../../../../utils/common/enums";
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
            console.log("RESP: ", resp);
        }
        catch (error) {
            globalAlert(TYPES.ERROR, "Delete", error);
        }
    };
    React.useEffect(() => {
        getAllQuestionsByComplex();
    }, [id]);
    return (<div className="container-fluid">
      <div className="row justify-content-center">
        <VoteModal id={id} dataAnswers={dataAnswers} modal={modal}/>
      </div>
      <div className="row py-2 justify-content-center">
        <h5>Conjunto: {name}</h5>
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
      <div className="pt-2" hidden={allQestions.length === 0}>
        {allQestions &&
            allQestions.map((pos, index) => {
                return (<div key={index} className="accordion" id={`accordion${index}`}>
                <div className="accordion-item">
                  <h2 className="accordion-header" id={`heading${index}`}>
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="false" aria-controls={`collapse${index}`}>
                      {pos?.question}
                    </button>
                  </h2>
                  <div id={`collapse${index}`} className="accordion-collapse collapse" aria-labelledby={`heading${index}`} data-bs-parent={`#accordion${index}`}>
                    <div className="accordion-body">
                      <div className="col-12 d-flex justify-content-start pb-2">
                        <div className="col-2">
                          <button id={pos?.id} type="button" className="col-11 btn btn-outline-warning btn-sm" onClick={() => {
                        setDataAnswers(pos);
                        setModal("show");
                    }}>
                            <FontAwesomeIcon icon={faEdit}/>
                          </button>
                        </div>
                        <div className="col-2">
                          <button id={pos?.id} type="button" className="col-11 btn btn-outline-danger btn-sm" onClick={() => deleteQuestion(pos?.id)}>
                            <FontAwesomeIcon icon={faTrash}/>
                          </button>
                        </div>
                      </div>
                      <div className="row">
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr className="text-center table-dark">
                                <th scope="col">Respuestas</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pos?.answers?.map((elem, answerIndex) => {
                        return (<tr key={answerIndex}>
                                      <td>{elem?.text}</td>
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
