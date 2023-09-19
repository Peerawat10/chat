import React, { memo } from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ArticleIcon from "@mui/icons-material/Article";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { DataFile } from "../App";
import { CancelTokenSource } from "axios";

function FileUpload({
  files,
  handleRemoveFile,
  handleUpload,
}: {
  files: DataFile[];
  handleRemoveFile: (id: string) => void;
  handleUpload: (files: DataFile, index: number) => void;
}) {
  const renderFilePreview = (file: File) => {
    if (file.type.startsWith("image")) {
      return (
        <Box sx={{ mr: 3 }}>
          <img
            width={68}
            height={68}
            alt={file.name}
            src={URL.createObjectURL(file as any)}
          />
        </Box>
      );
    } else {
      return (
        <Avatar>
          <ArticleIcon />
        </Avatar>
      );
    }
  };

  const renderButton = (file: DataFile, index: number) => {
    if (Object.values(file)[0].status === 0) {
      return (
        <IconButton
          edge="end"
          aria-label="upload"
          onClick={() => handleUpload(file, index)}
        >
          <CloudUploadIcon />
        </IconButton>
      );
    } else if (Object.values(file)[0].status === 1) {
      return (
        <IconButton
          edge="end"
          aria-label="upload"
          onClick={() => cancelUpload(Object.values(file)[0].cancelToken)}
        >
          <CancelIcon />
        </IconButton>
      );
    }
  };

  function LinearProgressWithLabel(
    props: LinearProgressProps & { value: number }
  ) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  const cancelUpload = (cancelToken: CancelTokenSource) => {
    cancelToken.cancel("Cancelled by user");
  };

  const getTimetring = (timeInSeconds: number | undefined = 0) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor(timeInSeconds / 60 - hours * 60);
    const seconds = Math.floor(timeInSeconds - minutes * 60 - hours * 3600);

    let timeString = `${seconds}  sec`;
    if (minutes) {
      timeString = `${minutes} min ${timeString}`;
    }

    if (hours) {
      timeString = `${hours} hrs ${timeString};`;
    }

    return timeString;
  };

  const fileList = Object.values(files).map((file: DataFile, index: number) => {
    return (
      <React.Fragment key={Object.keys(file)[0].toString()}>
        <ListItem
          secondaryAction={
            <Box style={{ display: "flex", flexDirection: "column" }}>
              {renderButton(file, index)}
              {Object.values(file)[0].status === 0 ||
              Object.values(file)[0].status === 2 ? (
                <IconButton
                  edge="end"
                  aria-label="delete"
                  // disabled={
                  //   !(Object.values(file)[0].status === 0) ||
                  //   !(Object.values(file)[0].status === 2)
                  // }
                  onClick={() =>
                    handleRemoveFile(Object.keys(file)[0].toString())
                  }
                >
                  <DeleteIcon />
                </IconButton>
              ) : null}
            </Box>
          }
        >
          <ListItemIcon>
            {renderFilePreview(Object.values(file)[0].file)}
          </ListItemIcon>
          <ListItemText
            primary={Object.values(file)[0].file.name}
            secondary={
              Math.round(Object.values(file)[0].file.size / 100) / 10 > 1000
                ? `${(
                    Math.round(Object.values(file)[0].file.size / 100) / 10000
                  ).toFixed(1)} mb`
                : `${(
                    Math.round(Object.values(file)[0].file.size / 100) / 10
                  ).toFixed(1)} kb`
            }
          />
        </ListItem>
        <Box sx={{ width: "100%" }}>
          {Object.values(file)[0].status === 1 ? (
            <React.Fragment>
              <Typography variant="caption" display="block" gutterBottom>
                is being Upload in{" "}
                {getTimetring(Object.values(file)[0].estimated)}
              </Typography>
              <LinearProgressWithLabel
                value={Object.values(file)[0].progress}
              />
            </React.Fragment>
          ) : null}
        </Box>
        <Divider />
      </React.Fragment>
    );
  });

  return (
    <>
      {files.length ? (
        <Grid container spacing={1} style={{ padding: "9px 20px 3px 20px" }}>
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {fileList}
          </List>
        </Grid>
      ) : null}
    </>
  );
}

export default memo(FileUpload);
