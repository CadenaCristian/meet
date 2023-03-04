import React from "react";
import { ZoomMtg } from "@zoomus/websdk";
let sdkKey = "BycCUkbEw25kssgoSiwNgykMnhPs9wVX7c96";
let leaveUrl = "http://localhost:3000/";
let password = "";
const Zoom = ({ username, meetingNumber, signature }) => {
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
