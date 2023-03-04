import React from "react";
import { onSnapshot, collection, query, where, updateDoc, arrayUnion, doc, } from "firebase/firestore";
import { useAppSelector } from "../../../redux/hooks";
import { firestore } from "../../../firebase_setup/firebase";
export default function VoteListmodal() {
    const { userData } = useAppSelector((state) => state.userdata);
    const [idQuestion, setIdQuestion] = React.useState("");
    const [choose, setChoose] = React.useState("");
    const [arrayQuestions, setArrayQuestions] = React.useState([]);
    const collectionRef = collection(firestore, "questions");
    const getAllVotesByComplex = async () => {
        const q = query(collectionRef, where("status", "==", true), where("complexId", "==", userData?.complexId));
        const unsub = onSnapshot(q, (querySnapshot) => {
            let dataArray = [];
            querySnapshot.forEach((doc) => {
                dataArray.push({ ...doc.data(), id: doc.id });
            });
            if (dataArray.length > 0) {
                // console.log("dataArray: ", dataArray);
                setArrayQuestions(dataArray);
            }
            else {
                setArrayQuestions([]);
            }
        });
        return () => unsub();
    };
    const addAnswer = async () => {
        try {
            await updateDoc(doc(firestore, "questions", idQuestion), {
                userAnswers: arrayUnion({
                    nickName: userData?.nickName,
                    answer: choose,
                }),
            });
            clearChoose();
        }
        catch (error) {
            console.log("error: ", error);
        }
    };
    const clearChoose = () => {
        setChoose("");
        setIdQuestion("");
    };
    const valVote = () => {
        if (!choose) {
            return true;
        }
        else if (userData?.vote === false) {
            return true;
        }
        else {
            return false;
        }
    };
    const valChoose = (text, chooseIdQuestion) => {
        if (choose === text && idQuestion === chooseIdQuestion) {
            return true;
        }
        else {
            return false;
        }
    };
    React.useEffect(() => {
        getAllVotesByComplex();
    }, []);
    console.log("userData: ", userData);
    return (<div className="container-fluid">
      <div className="row justify-content-center">
        <button type="button" className="col-12 col-md-4 btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Votaciones
        </button>

        <div className="modal fade" style={{ opacity: 1 }} id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={clearChoose}/>
              </div>
              <div className="modal-body">
                {arrayQuestions.length > 0 ? (<div className="col-12">
                    {arrayQuestions.map((pos, index) => {
                const valAnswer = pos?.userAnswers?.filter((fil) => fil?.nickName === userData?.nickName);
                return (<div key={index} className="text-center">
                          <div className="row text-start">
                            <label className={`fs-6 fw-lighter`}>
                              Votos registrados: {pos?.userAnswers?.length}
                            </label>
                          </div>
                          <div className="row">
                            <label className={`fs-6 fw-lighter`}>
                              {pos?.question}
                            </label>
                          </div>
                          <div className="col-12">
                            {valAnswer?.length > 0 ? (<div className="alert alert-success" role="alert">
                                Su respuesta ya ha sido registrada con éxito!
                              </div>) : (<>
                                {pos?.answers?.map((elem, indexAnswers) => {
                            return (<div key={indexAnswers} className="row justify-content-center col-12 form mx-0 pb-1">
                                        <button type="button" className={`col-md-7 col-12 btn btn-${valChoose(elem?.text, pos?.id)
                                    ? "primary"
                                    : "outline-primary"}`} onClick={() => {
                                    setIdQuestion(pos?.id);
                                    setChoose(elem?.text);
                                }}>
                                          {elem?.text}
                                        </button>
                                      </div>);
                        })}
                              </>)}
                          </div>
                        </div>);
            })}
                  </div>) : (<div className="alert alert-primary" role="alert">
                    No hay votaciones activas por el momento
                  </div>)}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={addAnswer} disabled={valVote()}>
                  Enviar respuesta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
