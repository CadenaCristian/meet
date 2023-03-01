import React from "react";
import { query, collection, onSnapshot } from "@firebase/firestore";
import { faEye, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { firestore } from "../../../../firebase_setup/firebase";
import UserListBycomplex from "./UserListBycomplex";
import global from "../../../../styles/global.module.css";
import users from "../../../../styles/users.module.css";
import { ROL } from "../../../../utils/common/enums";
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { getId } from "../../../../redux/features/user";
export default function User() {
    const dispatch = useAppDispatch();
    const { idUser } = useAppSelector((state) => state.userdata);
    const [nameComplex, setNameComplex] = React.useState("");
    const [rol, setRol] = React.useState("");
    const [spinner, setSpinner] = React.useState(true);
    const [allComplexData, setAllComplexData] = React.useState([]);
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
        });
        setSpinner(false);
        return () => unsub();
    };
    React.useEffect(() => {
        getAllComplex();
    }, []);
    return (<div className="container">
      <div className="row justify-content-between">
        <div className={`col-12 col-md-3 ${users.tableContainer}`}>
          <div className="row py-2 justify-content-around">
            <button className="col-8 btn btn-primary btn-sm" onClick={() => {
            dispatch(getId(ROL.ADMIN));
            setRol(ROL.ADMIN);
            setNameComplex(ROL.ADMIN);
        }}>
              Registro de administradores
            </button>
          </div>
          {spinner ? (<div className="row justify-content-center col-12">
              <div className="spinner-border text-primary" role="status"></div>
            </div>) : allComplexData.length > 0 ? (<div className="table-responsive overflow-auto">
              <table className="table text-center table-hover">
                <thead className="table-dark">
                  <tr>
                    <th className={`${global.theadSizeFont}`}>
                      Nombre completo
                    </th>
                    <th className={`${global.theadSizeFont}`}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {allComplexData.map((pos, index) => {
                return (<tr key={index}>
                        <td className={`text-center align-middle ${global.theadSizeFont}`}>
                          {pos?.name}
                        </td>
                        <td className="d-flex justify-content-around">
                          <button id={pos?.id} type="button" className="btn btn-primary btn-sm py-0 px-1" onClick={() => {
                        dispatch(getId(pos?.id));
                        setRol(ROL.USER);
                        setNameComplex(pos?.name);
                    }}>
                            <FontAwesomeIcon icon={faEye}/>
                          </button>
                        </td>
                      </tr>);
            })}
                </tbody>
              </table>
            </div>) : (<div className="row justify-content-center">
              <div className="col-12 alert alert-info" role="alert">
                No hay conjuntos por el momento
              </div>
              <button type="button" className="d-flex justify-content-around align-items-center col-12 col-md-5 btn btn-primary">
                <p className="p-0 m-0">Agregar conjunto</p>
                <FontAwesomeIcon icon={faPlusCircle}/>
              </button>
            </div>)}
        </div>
        <div className="col-12 col-md-9 px-0">
          <UserListBycomplex id={idUser} name={nameComplex} rol={rol}/>
        </div>
      </div>
    </div>);
}
