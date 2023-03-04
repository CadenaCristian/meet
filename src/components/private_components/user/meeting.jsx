import React from "react";
import Zoom from "./Zoom";
import { isMobile, isBrowser } from "mobile-device-detect";
import { doc, getDoc } from "firebase/firestore";
import { useAppSelector } from "../../../redux/hooks";
import { firestore } from "../../../firebase_setup/firebase";
const KJUR = require("jsrsasign");
const Meetings = () => {
    const { userData } = useAppSelector((state) => state.userdata);
    const [meetingNumber, setMeetingNumber] = React.useState(0);
    const [signature, setSignature] = React.useState("");
    const [joinMeeting, setJoinMeeting] = React.useState(false);
    const getIdMeeting = async () => {
        try {
            const ref = doc(firestore, "complex", userData?.complexId);
            const docSnap = await getDoc(ref);
            const number = parseInt(docSnap.data()?.idMeeting.replace(/\s/g, ""));
            return number;
        }
        catch (error) {
            console.log("ERROR: ", error);
        }
    };
    React.useEffect(() => {
        (async () => {
            setMeetingNumber(await getIdMeeting());
        })();
    }, []);
    React.useEffect(() => {
        (async () => {
            let sdkKey = "BycCUkbEw25kssgoSiwNgykMnhPs9wVX7c96";
            let apiSecret = "mc9A1c5jvrQv6WjHH5bytPvAfdWHB8rPqaMj";
            let role = 0;
            const generateSignature = async () => {
                const iat = Math.round((new Date().getTime() - 30000) / 1000);
                const exp = iat + 60 * 60 * 2;
                const oHeader = { alg: "HS256", typ: "JWT" };
                const oPayload = {
                    sdkKey: sdkKey,
                    mn: meetingNumber,
                    role: role,
                    iat: iat,
                    exp: exp,
                    appKey: sdkKey,
                    tokenExp: iat + 60 * 60 * 2,
                };
                const sHeader = JSON.stringify(oHeader);
                const sPayload = JSON.stringify(oPayload);
                const sdkJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, apiSecret);
                return sdkJWT;
            };
            const sig = await generateSignature();
            setSignature(sig);
        })();
    }, [meetingNumber !== 0]);
    return (<div className="App text-center">
      {joinMeeting ? (<Zoom username={userData?.nickName} meetingNumber={meetingNumber} signature={signature}/>) : (<div>
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
