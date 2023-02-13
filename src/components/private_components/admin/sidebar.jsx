import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../../styles/sidebar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faDoorOpen, faList, faUsers, } from "@fortawesome/free-solid-svg-icons";
export default function Sidebar() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    return (<div className={`col-auto col-md-1 col-xl-1 px-0 ${styles.container}`}>
      <div className="d-flex flex-column justify-content-between align-items-center align-items-sm-start px-0 pt-4 text-white min-vh-100">
        <div className="col-12">
          <ul id="menu" className="col-12 nav nav-pills flex-column ps-1 mb-sm-auto mb-0 align-items-center align-items-sm-start">
            <li className="col-12 nav-item px-0 mx-0 py-2">
              <button type="button" className={`col-12 d-flex justify-content-around align-items-center ${pathname === "/admin/dashboard/complex"
            ? styles.button_active
            : styles.button_inactive} btn-sm`} onClick={() => navigate("/admin/dashboard/complex")}>
                <FontAwesomeIcon icon={faBuilding}/>
                <p className={`p-0 m-0 ${styles.items}`}>Conjuntos</p>
              </button>
            </li>
            <li className="col-12 nav-item px-0 mx-0 py-2">
              <button type="button" className={`col-12 d-flex justify-content-around align-items-center ${pathname === "/admin/dashboard/voting"
            ? styles.button_active
            : styles.button_inactive} btn-sm`} onClick={() => navigate("/admin/dashboard/voting")}>
                <FontAwesomeIcon icon={faList}/>
                <p className={`p-0 m-0 ${styles.items}`}>Votaciones</p>
              </button>
            </li>
            <li className="col-12 nav-item px-0 mx-0 py-2">
              <button type="button" className={`col-12 d-flex justify-content-around align-items-center ${pathname === "/admin/dashboard/users"
            ? styles.button_active
            : styles.button_inactive} btn-sm`} onClick={() => navigate("/admin/dashboard/users")}>
                <FontAwesomeIcon icon={faUsers}/>
                <p className={`p-0 m-0 ${styles.items}`}>Usuarios</p>
              </button>
            </li>
          </ul>
        </div>
        <div className="col-12">
          <ul className="col-12 nav nav-pills flex-column ps-2 mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
            <li className="col-12 nav-item py-2">
              <button type="button" className={`col-12 px-md-1 d-flex justify-content-around align-items-center btn-sm ${styles.button_inactive}`}>
                <FontAwesomeIcon icon={faDoorOpen}/>
                <p className={`p-0 m-0 ${styles.items}`}>Cerrar sesión</p>
              </button>
            </li>
          </ul>
        </div>
        <hr />
      </div>
    </div>);
}
