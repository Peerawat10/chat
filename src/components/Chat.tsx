import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import ConnectedUsers from "./ConnectedUsers";
import { Divider } from "@mui/material";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import FileUpload from "./FileUpload";

function Chat({
  messages,
  sendMessage,
  closeConnection,
  users,
  handleUpload,
  handleSelectFiles,
  files,
  handleRemoveFile,
  inputRef,
}: any) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const container =
    window !== undefined ? () => window.document.body : undefined;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <React.Fragment>
      <Grid
        container
        justifyContent={"space-between"}
        sx={{ margin: "9px 0 9px 0" }}
      >
        <Grid item>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" className="header-message">
              Chat
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="error"
            onClick={() => closeConnection()}
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>
      <Grid container component={Paper}>
        <Box sx={{ flexShrink: { sm: 0 } }} aria-label="mailbox folders">
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 240,
              },
            }}
          >
            <ConnectedUsers users={users} />
          </Drawer>
        </Box>
        <Grid
          item
          display={{ xs: "none", sm: "inline" }}
          sm={3}
          sx={{ borderRight: "1px solid #e0e0e0" }}
        >
          <ConnectedUsers users={users} />
        </Grid>
        <Grid item xs={12} sm={9}>
          {/* <MessageContainer messages={messages} /> */}
          <Divider />
          <FileUpload
            files={files}
            handleRemoveFile={handleRemoveFile}
            handleUpload={handleUpload}
          />
          {/* <SendMessageForm
            semdMessage={sendMessage}
            handleSelectFiles={handleSelectFiles}
            inputRef={inputRef}
          /> */}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Chat;
