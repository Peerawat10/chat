import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import TabPanel from "./TabPanel";

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function RoomControl() {
  const [Rooms, setRooms] = useState([]);
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    feshdate();
  }, []);

  const feshdate = async () => {
    const DataRoom = await fetch(
      // "http://sev1.bsv-th-authorities.com/hub/api/Showroom",
      "https://localhost:7276/api/Showroom",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    ).then((responst) => responst.json().then((res) => res));
    setRooms(DataRoom);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        height: 224,
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        {Rooms.map((room, index) => (
          <Tab key={index} label={room} {...a11yProps(index)} />
        ))}
      </Tabs>
      {Rooms.map((room, index) => (
        <TabPanel key={index} value={value} index={index}>
          {room}
        </TabPanel>
      ))}
    </Box>
  );
}

export default RoomControl;
