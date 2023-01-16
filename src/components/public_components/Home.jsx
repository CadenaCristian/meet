import styles from "../../styles/home.module.css";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="container-fluid">
      <div className={`${styles.loginForm}`}>
        <button
          type="button"
          className="col-3 col-md-2 btn btn-primary"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    </div>
  );
};
export default Home;
