import React, { ChangeEvent, useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

interface Register {
  user?: string;
}

function Lobby({ joinRoom }: any) {
  const [regidter, setRegidter] = useState<Register>({ user: "" });

  const JoinGroup = (e: any) => {
    e.preventDefault();
    joinRoom(regidter?.user);
  };

  const handleChang = (event: ChangeEvent<HTMLInputElement>) => {
    setRegidter({
      ...regidter,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Paper elevation={3} sx={{ padding: "59px 0px 59px 0px", marginTop: 10 }}>
      <Grid
        container
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item md={8} xs={10}>
          <Typography variant="h5" gutterBottom>
            Create NameToChat
          </Typography>
        </Grid>
        <Grid item md={8} xs={10}>
          <TextField
            fullWidth
            name="user"
            label="Name"
            variant="outlined"
            onChange={handleChang}
          />
        </Grid>
        <Grid item md={8} xs={10}>
          <Button
            fullWidth
            variant="outlined"
            color="info"
            size="large"
            onClick={JoinGroup}
            disabled={!regidter?.user}
          >
            Join
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Lobby;
