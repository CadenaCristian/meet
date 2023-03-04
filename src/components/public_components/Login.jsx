import React, { useState } from "react";
import styles from "../../styles/login.module.css";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Navigate, useNavigate } from "react-router-dom";
import { globalAlert } from "../../utils/common/functions";
import { TYPES } from "../../utils/common/enums";
import { changeAuthStatus, updateRol, updateUserNameData, } from "../../redux/features/user";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { firestore } from "../../firebase_setup/firebase";
const Login = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [path, setPath] = React.useState("");
    const collectionRef = collection(firestore, "users");
    const [spinner, setSpinner] = useState(false);
    const { isAuth } = useAppSelector((state) => state.userdata);
    const [dataUserValue, setdataUserValue] = useState({
        userName: "",
        password: "",
    });
    const { userName, password } = dataUserValue;
    const setDataUser = ({ target }) => {
        setdataUserValue({
            ...dataUserValue,
            [target.name]: target.value,
        });
    };
    const login = async () => {
        let userData = [];
        setSpinner(true);
        const q = query(collectionRef, where("userData.nickName", "==", `${userName}`));
        const unsub = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                userData.push({ ...doc.data(), id: doc.id });
            });
            if (userData.length < 1 || userData === undefined) {
                globalAlert(TYPES.WARNING, "Usuario", "El usuario ingresado no existe", 2000);
            }
            else if (userData.length > 0) {
                dispatch(updateUserNameData({
                    id: userData[0]?.id,
                    complexId: userData[0]?.complexId,
                    nickName: userData[0]?.userData?.nickName,
                    vote: userData[0]?.userData?.vote,
                }));
                console.log("userData[0]?.userData: ", userData[0]?.userData);
                dispatch(changeAuthStatus(true));
                dispatch(updateRol(userData[0]?.userData?.rol));
                navigate(`${userData[0]?.userData?.rol === "admin"
                    ? setPath("/admin/dashboard")
                    : setPath("/meetings")}`);
            }
            setSpinner(false);
            return () => unsub();
        });
    };
    if (isAuth)
        return <Navigate to={`${path}`}/>;
    return (<>
      <div className={`${styles.loginForm}`}>
        <div className="col-10 col-md-3 border border-secondary-subtle rounded p-3">
          <h4>Iniciar sesión</h4>
          <form>
            <div className="mb-3">
              <label className="form-label">Nombre de usuario</label>
              <input type="text" id="userName" name="userName" value={userName} className="form-control" onChange={(e) => setDataUser(e)}/>
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input type="password" id="password" name="password" value={password} className="form-control" onChange={(e) => setDataUser(e)}/>
            </div>
            <div className="row justify-content-center">
              {!spinner ? (<button type="button" className="col-6 btn btn-primary" disabled={userName.length < 1 || password.length < 1} onClick={() => login()}>
                  Ingresar
                </button>) : (<button className="col-6 btn btn-primary" type="button">
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                  <span className="visually ps-1">Cargando...</span>
                </button>)}
            </div>
          </form>
        </div>
      </div>
    </>);
};
export default Login;
