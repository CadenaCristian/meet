import React from "react";
import VoteListmodal from './VoteListmodal';
import QuorumListModal from './QuorumListModal';
export default function MenuUser() {
    return (<div className="container">
      <div className="row justify-content-around">
        <div className="col-6"><VoteListmodal /></div>
        <div className="col-6"><QuorumListModal /></div>
      </div>
    </div>);
}
