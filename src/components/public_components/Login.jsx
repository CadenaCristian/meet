import React, { useState } from "react";
import styles from "../../styles/login.module.css";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Navigate, useNavigate } from 'react-router-dom';
import { globalAlert } from "../../utils/common/functions";
import { TYPES } from "../../utils/common/enums";
import { changeAuthStatus, updateUserNameData } from "../../redux/features/user";
const Login = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
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
            email: "email@gmail.com"
        },
        {
            username: "steven",
            password: "1234",
            email: "email@gmail.com"
        },
        {
            username: "linda",
            password: "1234",
            email: "email@gmail.com"
        },
    ];
    const setDataUser = ({ target }) => {
        setdataUserValue({
            ...dataUserValue,
            [target.name]: target.value,
        });
    };
    const login = async () => {
        console.log(`USERNAME: ${userName}, PASS: ${password}`);
        const userdata = db.find((element) => element.username === userName);
        if (userdata === undefined) {
            globalAlert(TYPES.WARNING, "Usuario", "El usuario ingresado no existe");
        }
        else if (userdata.username === userName && userdata.password === password) {
            globalAlert(TYPES.SUCCESS, "Bienvenido!", "Bienvenido a su asamblea");
            dispatch(updateUserNameData(userdata));
            dispatch(changeAuthStatus(true));
            navigate("/meetings");
        }
        else if (userdata.username === userName && userdata.password !== password) {
            globalAlert(TYPES.ERROR, "Usuario", "La contraseña ingresada es incorrecta");
        }
    };
    if (isAuth)
        return <Navigate to="/meetings"/>;
    return (<>
      <div className={`${styles.loginForm}`}>
        <div className="col-3 border border-secondary-subtle rounded p-3">
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
            <button type="button" className="btn btn-primary" onClick={() => {
            // globalAlert(TYPES.SUCCESS, "Titulo", "Inicio sesión");
            login();
        }}>
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </>);
};
export default Login;
