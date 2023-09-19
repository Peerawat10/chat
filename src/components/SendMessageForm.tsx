import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";

function SendMessageForm({ 
  SendMessage,
  SendImage, }: { 
    SendMessage: (message: string) => void;
    SendImage: (fileData: File) => void; 
  }) {
  const [message, setMessage] = useState<string>("");
  const [image, setImage] = useState<File | null>(null); 

  const SubmitMessage = (e: any) => {
    e.preventDefault();
    if(message != null && message != "") {
      SendMessage(message);
      setMessage("");
    }
    if(image != null){
      SendImage(image);
      setImage(null);
    }
  };

  const handleInputMessageChang = (even: any) => {
    // console.log(even);
    setMessage(even.target.value)
  }

  const openFileSelector = () => {
    (document.getElementById("upload-button") as HTMLInputElement).click();
  }

  const handleImageUpload = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const uploadedImage = event.target.files[0];
      setImage(uploadedImage);
      const imageUrl = URL.createObjectURL(uploadedImage);
      console.log("Image URL:", imageUrl); // You can use this URL to display the uploaded image
    }
  }

  return (
    <Grid container spacing={1} style={{ padding: "20px" }}>
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Type Something"
          id="txtmessage"
          type="text"
          onChange={handleInputMessageChang}
          value={message}
          autoComplete="off"
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <input 
        type="file" 
        id="upload-button" 
        style={{ display: "none" }} 
        onChange={handleImageUpload}
      />
        <IconButton         
          onClick={openFileSelector}
        >
          <AttachFileIcon/>
        </IconButton>
        <IconButton
          color="primary"
          sx={{ p: "10px" }}
          aria-label="directions"
          disabled={!message && !image}
          onClick={SubmitMessage}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Grid>
  );
}

export default SendMessageForm;
