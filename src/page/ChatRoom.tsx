  import React from "react";
  import MessageContainer from "../components/MessageContainer";
  import { NewMessages } from "../Models/NewMessages";
  import { Divider } from "@mui/material";
  import SendMessageForm from "../components/SendMessageForm";
  import { User } from "../Models/Users";

  function ChatRoom({
    SendMessage,
    SendImage,
    Messages,
    userSelect,
  }: {
    SendMessage: (message: string) => void;
    SendImage: (fileData: File) => void;
    Messages: NewMessages[];
    userSelect: User;
  }) {
    return (
      <React.Fragment>
        {Messages.length > 0 ? (
          <MessageContainer messages={Messages} userSelect={userSelect} />
        ) : (
          ""
        )}

        <Divider />
        <SendMessageForm
         SendMessage={SendMessage} 
         SendImage={SendImage}
        />
      </React.Fragment>
    );
  }

  export default ChatRoom;
