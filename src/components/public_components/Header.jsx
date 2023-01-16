import React from "react";
import logo from "../../assets/logo.png";
import styles from "../../styles/header.module.css";
const Header = () => {
    return (<>
      <div className="row justify-content-center">
        <img src={`${logo}`} alt="Logo corporativo" className={`${styles.logo}`}/>
      </div>
    </>);
};
export default Header;
