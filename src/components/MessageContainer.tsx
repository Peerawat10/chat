import React, { useEffect, useRef } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import { NewMessages } from "../Models/NewMessages";
import { User } from "../Models/Users";

function MessageContainer({
  messages,
  userSelect,
}: {
  messages: NewMessages[];
  userSelect: User;
}) {
  const messageRef = useRef<any>();

  useEffect(() => {
    if (messageRef && messageRef.current) {
      const { scrollHeight, clientHeight } = messageRef.current;
      messageRef.current.scrollTo({
        left: 0,
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <List
      ref={messageRef}
      sx={{
        height: "73vh",
        overflowY: "auto",
      }}
    >
      <Grid container>
        {messages[0].Message.map((m, index) => (
          <ListItem key={index}>
            <Grid item xs={12}>
              <ListItemText
                style={
                  m.Author === userSelect.userName
                    ? { textAlign: "left" }
                    : { textAlign: "end" }
                }
                primary={m.NewMessage}
                secondary={"-- " + m.Author}
              />
            </Grid>
          </ListItem>
        ))}
      </Grid>
    </List>
  );
}

export default MessageContainer;
