import React, { ChangeEvent, useRef, useState } from "react";
import Lobby from "./page/Lobby";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import Chat from "./components/Chat";
import Dashboard from "./page/Dashboard";
import axios, { AxiosProgressEvent, CancelTokenSource } from "axios";
import { v4 as uuidv4 } from "uuid";
import { User } from "./Models/Users";
import { NewMessages } from "./Models/NewMessages";

export interface DataFile {
  [id: string]: {
    id: string;
    file: File;
    progress: number;
    status: number; //0 wait, 1 uploading, 2 faile, 3 success
    cancelToken: CancelTokenSource;
    estimated?: number;
  };
}

function App() {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [files, setFiles] = useState<DataFile[]>([]);
  const [messages, setMessages] = useState<NewMessages[]>([]);
  const [me, setMe] = useState<User>({ connectionId: "", userName: "" });

  const joinRoom = async (user: string) => {
    try {
      const connection: HubConnection = new HubConnectionBuilder()
        // .withUrl("https://192.168.1.105:7276/chat")
        // .withUrl("http://192.168.1.103:5101/chat")
        // .withUrl("http://devpixelia.online/hub/chat")
        // .withUrl("http://192.168.1.100:5101/chat")
        .withUrl("http://sev1.bsv-th-authorities.com/hub/chat")
        // .withUrl("http://Fsev1.bsv-th-authorities.com/hub/chat")
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("NewOnlineUser", (user) => {
        console.log(user);
        setMe(user); 
      });

      connection.onclose((e) => {
        setMessages([]);
        setConnection(null);
      });

      connection.on("UserDisconnection", (userID) => {
        //Remove Chat Hisory in Other client  state
        setMessages((prevState) => {
          return prevState.filter((m) => m.User.connectionId !== userID);
        });
      });

      connection.on("OnlineUsers", (AllUser: any) => {
        console.log(AllUser);
      });

      connection.on(
        "ReceiveMessage",
        (message: string, userInfoSender: User,type: string) => {
          console.log("message received: ", message);
          console.log("message type: ", type ?? "message");
          console.log(userInfoSender);


          setMessages((prevState) => {
            let msg = prevState.find(
              (m) => m.User.connectionId === userInfoSender.connectionId
            );

            if (!!msg) {  
              return prevState.map((m) => {
                if (m.User.connectionId === userInfoSender.connectionId) {
                  return {
                    ...m,
                    Message: [
                      ...m.Message,
                      {
                        Author: userInfoSender.userName,
                        NewMessage: message,
                      },
                    ],
                  };
                } else {
                  return m;
                }
              });
            } else {
              return [
                ...prevState,
                {
                  User: userInfoSender,
                  Message: [
                    {
                      Author: userInfoSender.userName,
                      NewMessage: message,
                    },
                  ],
                },
              ];
            }
          });
        }
      );

      await connection.start();

      await connection.invoke("JoinRoom", user);
      console.log(connection);
      setConnection(connection);
    } catch (error) {
      console.log(error);
    }
  };

  const closeConnection = async () => {
    try {
      await connection?.stop();
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (message: string, receiverName: User) => {
    try {
      console.log(messages);

      setMessages((prevState) => {
        let msg = prevState.find(
          (m) => m.User?.connectionId === receiverName.connectionId
        );
        if (!!msg) {
          return prevState.map((m) => {
            if (m.User?.connectionId === receiverName.connectionId) {
              return {
                ...m,
                Message: [
                  ...m.Message,
                  {
                    Author: me.userName,
                    NewMessage: message,
                  },
                ],
              };
            } else {
              return m;
            }
          });
        } else {
          return [
            ...prevState,
            {
              User: receiverName,
              Message: [
                {
                  Author: me.userName,
                  NewMessage: message,
                },
              ],
            },
          ];
        }
      });

      await connection?.invoke(
        "SendMessageDM",
        message,
        receiverName.connectionId,
        'msg'
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpload = async (fileData: File,selectionId: string) => {
    const formData: any = new FormData();
   
    formData.append("files", fileData);
    formData.append("ConnectionId", connection?.connectionId);
    formData.append("SelectionId", selectionId);

    let TempFile: DataFile[] = files;
    // TempFile[index][id].status = 1; //changStatus
    const res = await axios
      // http://localhost:5101/api/Upload
      // http://sev1.bsv-th-authorities.com/hub/api/Upload
      .post("http://sev1.bsv-th-authorities.com/hub/api/Upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // cancelToken: cancelToken.token,
        // onUploadProgress(progressEvent: AxiosProgressEvent) {
        //   if (progressEvent?.progress && progressEvent?.total) {
        //     let percen = Math.round(100 * progressEvent.progress);

        //     TempFile[index][id].progress = percen;
        //     TempFile[index][id].estimated = progressEvent.estimated || 0;
        //     setFiles([...TempFile]);
        //   }
        // },
      })
      // .catch((error) => {
      //   if (axios.isCancel(error)) {
      //     // Do something when user cancel upload
      //     TempFile[index][id].status = 2;
      //     setFiles([...TempFile]);
      //     console.log(error.message);
      //   }
      // });

    if (res?.status === 200) {
      // TempFile[index][id].status = 3;
      setFiles([...TempFile]);
    }
  };

  const handleSelectFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const file: FileList | null = e.currentTarget.files;

    if (file) {
      console.log(file);

      let tempData: DataFile[] = Array.from(file).map((file: File) => {
        // let uuid = crypto.randomUUID();
        let uuid = uuidv4();
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        return {
          [uuid]: {
            id: uuid,
            progress: 0,
            file,
            status: 0,
            cancelToken: source,
          },
        };
      });
      // console.log(Object.keys(tempData[0])[0]);
      // console.log(tempData);
      // setFiles(Array.from(file).map((file: File) => Object.assign(file)));
      setFiles(tempData);
    }
  };

  const handleRemoveFile = (iid: string) => {
    const filtered = files.filter(
      (i: DataFile) => Object.keys(i)[0].toString() !== iid
    );
    setFiles([...filtered]);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth={!connection ? "sm" : "xl"}>
        {!connection ? (
          <Lobby joinRoom={joinRoom} />
        ) : (
          // <Chat
          //   messages={messages}
          //   sendMessage={sendMessage}
          //   closeConnection={closeConnection}
          //   users={users}
          //   handleUpload={handleUpload}
          //   files={files}
          //   handleSelectFiles={handleSelectFiles}
          //   handleRemoveFile={handleRemoveFile}
          //   inputRef={inputRef}
          // />
          <Dashboard
            Me={me}
            closeConnection={closeConnection}
            connection={connection}
            sendMessage={sendMessage}
            messages={messages}
            handleUpload={handleUpload}
          />
        )}
      </Container>
    </React.Fragment>
  );
}

export default App;
