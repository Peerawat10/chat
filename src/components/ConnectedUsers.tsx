import React from "react";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";

function ConnectedUsers({ users }: any) {
  return (
    <React.Fragment>
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Connected Users
          </ListSubheader>
        }
      >
        {users.map((u: string, index: number) => (
          <ListItemButton key={index}>
            <ListItemIcon>
              <Avatar>{u.substring(0, 1)}</Avatar>
            </ListItemIcon>
            <ListItemText primary={u} />
          </ListItemButton>
        ))}
      </List>
    </React.Fragment>
  );
}

export default ConnectedUsers;
