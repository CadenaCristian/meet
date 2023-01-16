import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthComponent from "./components/auth/AuthComponent";
import Home from "./components/public_components/Home";
import Login from "./components/public_components/Login";
import Meetings from "./components/private_components/meeting";
import Header from "./components/public_components/Header";
function App() {
    return (<>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/meetings" element={<AuthComponent>
                <Meetings />
              </AuthComponent>}/>
          <Route path="*" element={<p>Not found</p>}/>
        </Routes>
      </BrowserRouter>
    </>);
}
export default App;
