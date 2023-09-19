import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import SendMessageForm from "../components/SendMessageForm";
import { Group } from "../Models/Groups";
import { Avatar } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function GroupRoom({
  SendGroupMessage,
  UserIngroup,
}: {
  SendGroupMessage: (message: string) => void;
  UserIngroup: Group[];
}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Item>xs=8</Item>
          <Divider />
          {/* <SendMessageForm SendMessage={SendGroupMessage} /> */}
        </Grid>
        <Grid item xs={4}>
          <Item>
            <List>
              {UserIngroup[0].gUsers?.map((user, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <Avatar>{user.userName.substring(0, 1)}</Avatar>
                    </ListItemIcon>
                    <ListItemText primary={user.userName} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}

export default GroupRoom;
