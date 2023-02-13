import React, { useState } from "react";
import styles from "../../styles/login.module.css";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Navigate, useNavigate } from "react-router-dom";
import { globalAlert } from "../../utils/common/functions";
import { TYPES } from "../../utils/common/enums";
import { changeAuthStatus, updateRol, updateUserNameData, } from "../../redux/features/user";
const Login = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [spinner, setSpinner] = useState(false);
    const { isAuth } = useAppSelector((state) => state.userdata);
    const [dataUserValue, setdataUserValue] = useState({
        userName: "",
        password: "",
    });
    const { userName, password } = dataUserValue;
    const db = [
        {
            username: "cristian",
            password: "1234",
            rol: "admin",
            email: "email@gmail.com",
        },
        {
            username: "steven",
            password: "1234",
            rol: "user",
            email: "email@gmail.com",
        },
        {
            username: "linda",
            password: "1234",
            rol: "user",
            email: "email@gmail.com",
        },
    ];
    const setDataUser = ({ target }) => {
        setdataUserValue({
            ...dataUserValue,
            [target.name]: target.value,
        });
    };
    const login = async () => {
        setSpinner(true);
        const userdata = db.find((element) => element.username === userName);
        if (userdata === undefined) {
            globalAlert(TYPES.WARNING, "Usuario", "El usuario ingresado no existe");
        }
        else if (userdata.username === userName && userdata.password === password) {
            dispatch(updateUserNameData(userdata));
            dispatch(changeAuthStatus(true));
            dispatch(updateRol(userdata?.rol));
            navigate(`${userdata?.rol === "admin" ? "/admin/dashboard" : "/meetings"}`);
        }
        else if (userdata.username === userName && userdata.password !== password) {
            globalAlert(TYPES.ERROR, "Usuario", "La contraseña ingresada es incorrecta");
        }
        setSpinner(false);
    };
    if (isAuth)
        return <Navigate to="/meetings"/>;
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
