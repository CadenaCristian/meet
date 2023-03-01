import React from "react";
import logo from "../../assets/logo.png";
import styles from "../../styles/header.module.css";
import { useAppSelector } from '../../redux/hooks';
import MenuUser from "../private_components/user/Menu";
const Header = () => {
    const { rol } = useAppSelector((state) => state.userdata);
    let component = "";
    switch (rol) {
        case "user":
            component = <MenuUser />;
            break;
        default:
            break;
    }
    return (<div className={`container`}>
      <div className="row justify-content-center">
        <img src={`${logo}`} alt="Logo corporativo" className={`${styles.logo}`}/>
        {component}
      </div>
    </div>);
};
export default Header;
