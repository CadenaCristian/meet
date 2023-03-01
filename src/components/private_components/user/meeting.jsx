import React from "react";
import Zoom from "./Zoom";
import { isMobile, isBrowser, } from "mobile-device-detect";
import { useAppSelector } from "../../../redux/hooks";
const Meetings = () => {
    const { userData } = useAppSelector((state) => state.userdata);
    const [joinMeeting, setJoinMeeting] = React.useState(false);
    return (<div className="App text-center">
      {joinMeeting ? (<Zoom username={userData?.nickName}/>) : (<div>
          <h1>Meetings</h1>
          <a href="https://us06web.zoom.us/j/82637450777" className="btn btn-primary" target="_blank" rel="noreferrer" hidden={!isMobile}>
            Abrir con la aplicación
          </a>
          <button type="button" className="btn btn-primary" onClick={() => setJoinMeeting(true)} hidden={!isBrowser}>
            Unirse a la reunión
          </button>
        </div>)}
    </div>);
};
export default Meetings;
