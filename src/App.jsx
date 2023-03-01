import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthComponent from "./components/auth/AuthComponent";
import Home from "./components/public_components/Home";
import Login from "./components/public_components/Login";
import Meetings from "./components/private_components/user/Meeting";
import Header from "./components/public_components/Header";
import Index from "./components/private_components/admin";
import Complex from "./components/private_components/admin/complex/Complex";
import Vote from "./components/private_components/admin/vote/Vote";
import User from "./components/private_components/admin/user/User";
function App() {
  return (
    <div className="p-0 m-0">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/meetings"
            element={
              <AuthComponent>
                <Meetings />
              </AuthComponent>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AuthComponent>
                <Index />
              </AuthComponent>
            }
          />
          <Route
            path="/admin/dashboard/complex"
            element={
              <AuthComponent>
                <Index>
                  <Complex />
                </Index>
              </AuthComponent>
            }
          />
          <Route
            path="/admin/dashboard/voting"
            element={
              <AuthComponent>
                <Index>
                  <Vote />
                </Index>
              </AuthComponent>
            }
          />
          <Route
            path="/admin/dashboard/users"
            element={
              <AuthComponent>
                <Index>
                  <User />
                </Index>
              </AuthComponent>
            }
          />
          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
