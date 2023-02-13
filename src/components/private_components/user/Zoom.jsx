import React from "react";
import { ZoomMtg } from "@zoomus/websdk";
const KJUR = require("jsrsasign");
const generateSignature = async (sdkKey, sdkSecret, meetingNumber, role) => {
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
    const sdkJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, sdkSecret);
    return sdkJWT;
};
let sdkKey = "BycCUkbEw25kssgoSiwNgykMnhPs9wVX7c96";
let apiSecret = "mc9A1c5jvrQv6WjHH5bytPvAfdWHB8rPqaMj";
let meetingNumber = 82637450777;
let role = 0;
let leaveUrl = "http://localhost:3000/";
let password = "";
let signature = "";
generateSignature(sdkKey, apiSecret, meetingNumber, role).then((data) => (signature = data));
const Zoom = ({ username, email }) => {
    React.useEffect(() => {
        const initiateMeeting = () => {
            ZoomMtg.init({
                leaveUrl: leaveUrl,
                success: (success) => {
                    ZoomMtg.join({
                        sdkKey: sdkKey,
                        signature: signature,
                        meetingNumber: meetingNumber,
                        passWord: password,
                        userName: username,
                        success: (success) => {
                            console.log("SJOIN: ", success);
                        },
                        error: (error) => {
                            console.log("EJOIN: ", error);
                        },
                    });
                },
                error: (error) => {
                    console.log("EINIT: ", error);
                },
            });
        };
        showZoomDiv();
        ZoomMtg.setZoomJSLib("https://source.zoom.us/2.9.5/lib", "/av");
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareWebSDK();
        initiateMeeting();
    }, [username]);
    const showZoomDiv = () => {
        const div = document.getElementById("zmmtg-root") || null;
        div.style.display = "block";
    };
    return (<></>);
};
export default Zoom;
