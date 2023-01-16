import React from "react";
import Zoom from "./Zoom";
import { useAppSelector } from "../../redux/hooks";
const Meetings = () => {
    const { userData } = useAppSelector((state) => state.userdata);
    const [joinMeeting, setJoinMeeting] = React.useState(false);
    console.log("MEETINGS USER DATA: ", userData);
    return (<div className="App">
      {joinMeeting ? (<Zoom username={userData?.username} email={userData?.email}/>) : (<div>
          <h1>Meetings</h1>
          <button type="button" className="btn btn-primary" onClick={() => setJoinMeeting(true)}>Join Meeting</button>
        </div>)}
    </div>);
};
export default Meetings;
