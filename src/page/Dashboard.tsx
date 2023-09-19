import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import PeopleIcon from "@mui/icons-material/People";
import MessageIcon from "@mui/icons-material/Message";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useTheme } from "@mui/material/styles";
import { User } from "../Models/Users";
import { Avatar, IconButton, ListSubheader, TextField } from "@mui/material";
import { HubConnection } from "@microsoft/signalr";
import { Group } from "../Models/Groups";
import ChatRoom from "./ChatRoom";
import { NewMessages } from "../Models/NewMessages";
import GroupRoom from "./GroupRoom";

interface props {
  closeConnection: () => void;
  connection: HubConnection;
  sendMessage: (message: string, receiverName: User) => void;
  messages: NewMessages[];
  handleUpload: (fileData: File,selectionId: string) => Promise<any>; 
  Me: User;
}

const drawerWidth = 240;
function Dashboard({
  closeConnection,
  connection,
  sendMessage,
  messages,
  handleUpload,
  Me,
}: props) {
  const GroupslistRef = useRef<any>([]);
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [userSelect, setUserSelect] = useState<User>({
    connectionId: "",
    userName: "",
  });
  const [useGroup, setUserGroup] = useState<Group>();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (users.length === 0) {
      getUsers();
      getGroups();
    }

    connection.on("UserReload", () => {
      getUsers();
    });

    connection.on("GroupReload", () => {
      console.log("reloadGroup");
      getGroups();
    });
  }, []);

  const getUsers = useCallback(async () => {
    console.log('Hubconnection ID: '+connection.connectionId);
    const Users = await fetch(
      // "http://sev1.bsv-th-authorities.com/hub/api/Showroom",
      `http://sev1.bsv-th-authorities.com/hub/api/allusers/${connection.connectionId}`,
      // `http://192.168.1.100:5101/api/allusers/${connection.connectionId}`,
      // `http://devpixelia.online/hub/api/allusers/${connection.connectionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    ).then((responst) => responst.json());
    console.log(Users);
    setUsers(Users);
  }, [users]);

  const getGroups = useCallback(async () => {
    const groups = await fetch(
      // "http://sev1.bsv-th-authorities.com/hub/api/Showroom",
      `http://sev1.bsv-th-authorities.com/hub/api/allgroups`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    ).then((responst) => responst.json());
    console.log(groups);
    setGroups(groups);
  }, [groups]);

  const SendMessage = (message: string) => {
    sendMessage(message, userSelect);
  };

  const SendImage = (fileData: File) => {
    handleUpload(fileData, userSelect.connectionId);
  }

  const SendGroupMessage = (message: string) => {
    console.log(message);
  };

  const handleCreateGroups = async () => {
    let groupID = await fetch(`http://sev1.bsv-th-authorities.com/hub/api/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({ groupName }),
    }).then((responst) => responst.json());
    setOpen(false);
    console.log(groupID);
    connection
      .invoke("SubscribeToGroup", groupID)
      .then(async () => {
        await getGroups();
        setUserGroup({
          ...useGroup,
          groupName: "",
          groupId: groupID,
        });
      })
      .catch((err: Error) => {
        return console.error(err.toString());
      });
  };

  const handleChatForDm = (userID: User) => {
    setUserGroup(undefined);
    setUserSelect(userID);
  };

  const handleChatGroup = (groupId: Group) => {
    setUserSelect({ connectionId: "", userName: "" });
    setUserGroup(groupId);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddUserToGroup = (groupID: string | undefined) => {
    connection
      .invoke("SubscribeToGroup", groupID)
      .then(() => {
        getGroups();
      })
      .catch((err: Error) => {
        return console.error(err.toString());
      });
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" noWrap component="div">
              {Me.userName}
            </Typography>
            <Button color="inherit" onClick={closeConnection}>
              Leave
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Divider />
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                users online
              </ListSubheader>
            }
          >
            {users.map((user, index) => (
              <ListItemButton
                key={index}
                selected={userSelect?.connectionId === user.connectionId}
                onClick={() => handleChatForDm(user)}
              >
                <ListItemIcon>
                  <Avatar>{user.userName.substring(0, 1)}</Avatar>
                </ListItemIcon>
                <ListItemText primary={user.userName} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <span> Groups</span>
                  <IconButton
                    aria-label="delete"
                    size="medium"
                    onClick={handleClickOpen}
                  >
                    <GroupAddIcon />
                  </IconButton>
                </Box>
              </ListSubheader>
            }
          >
            {groups.map((group, index) => (
              <ListItem
                id={group.groupId}
                ref={(e) => (GroupslistRef.current[index] = e)}
                key={group.groupId}
                disablePadding
                secondaryAction={
                  !!group.gUsers?.find(
                    (u) => u.connectionId === connection.connectionId
                  ) ? (
                    <IconButton edge="end" aria-label="delete">
                      <MessageIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleAddUserToGroup(group.groupId)}
                    >
                      <ExitToAppIcon />
                    </IconButton>
                  )
                }
                onClick={
                  !!group.gUsers?.find(
                    (u) => u.connectionId === connection.connectionId
                  )
                    ? () => handleChatGroup(group)
                    : undefined
                }
              >
                <ListItemButton selected={useGroup?.groupId === group.groupId}>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary={group.groupName} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Toolbar />
          {userSelect.connectionId !== "" || useGroup?.groupId !== undefined ? (
            userSelect.connectionId !== "" ? (
              <ChatRoom
                SendMessage={SendMessage}
                SendImage={SendImage}
                Messages={messages.filter(
                  (m) => m.User.connectionId === userSelect.connectionId
                )}
                userSelect={userSelect}
              />
            ) : (
              <GroupRoom
                SendGroupMessage={SendGroupMessage}
                UserIngroup={groups.filter(
                  (g) => g.groupId === useGroup?.groupId
                )}
              />
            )
          ) : (
            <Typography variant="h4" gutterBottom>
              Welcom To Chat Room 😁
            </Typography>
          )}
        </Box>
      </Box>
      <Dialog
        fullScreen={fullScreen}
        maxWidth={"md"}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Create New Group?"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="groupName"
            label="Group Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setGroupName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => handleCreateGroups()}>
            create Groups
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default memo(Dashboard);
