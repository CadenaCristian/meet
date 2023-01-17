import styles from "../../styles/home.module.css";
import { useNavigate } from "react-router-dom";
const Home = () => {
    const navigate = useNavigate();
    return (<div className="bg-secondary container-fluid">
      <div className={`${styles.loginForm}`}>
        <button type="button" className="btn btn-primary" onClick={() => navigate("/login")}>Login</button>
      </div>
    </div>);
};
export default Home;
