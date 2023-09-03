import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { myContext } from "./MainContainer";
import axios from "axios";

const Conversation = () => {
  const user = JSON.parse(localStorage.getItem("userData")).data;
  const navigate = useNavigate();
  const isLight = useSelector((state) => state.themeKey);
  const { refresh, setRefresh } = useContext(myContext);
  

  const [conversations, setConversations] = useState([]);
  console.log("fetched")
  useEffect(() => {
    console.log(refresh)
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios.get("https://chatappbackend-gkwr.onrender.com/chat/", config).then((response) => {
      setConversations(response.data);
      console.log(response.data);
    });
  }, [refresh]);

  return (
    <div className={"conversations" + (isLight ? "" : " dark")}>
      {conversations.map((conversation, index) => {
        console.log(conversation);

        let chatUser = "";
        const isGroupChat = conversation.isGroupChat;
        if (user._id === conversation.users[0]._id) {
          chatUser = conversation.users[1];
        } else {
          chatUser = conversation.users[0];
        }

        if (conversation.users.length === 1) {
          return <div key={index}></div>;
        }
        if (conversation.latestMessage === undefined) {
          return (
            <div
              key={index}
              onClick={() => {
                console.log("Refresh fired from sidebar");
                setRefresh(!refresh);
              }}
            >
              <div
                key={index}
                className={
                  "conversationContainer" + (isLight ? "" : " conDark")
                }
                onClick={() => {
                  navigate(
                    "/app/chat/" +
                      conversation._id +
                      "&" +
                      (isGroupChat ? conversation.chatName : chatUser.name)
                  );
                }}
              >
                <p className={"conIcon" + (isLight ? "" : " conIconDark")}>
                  {isGroupChat ? conversation.chatName[0] : chatUser.name[0]}
                </p>
                <p className={"conTitle" + (isLight ? "" : " conTitleDark")}>
                  {isGroupChat ? conversation.chatName : chatUser.name}
                </p>

                <p className="conLastMessage">
                  No previous Messages, click here to start a new chat
                </p>
              </div>
            </div>
          );
        } else {
          return (
            <div
              key={index}
              className={"conversationContainer" + (isLight ? "" : " conDark")}
              onClick={() => {
                navigate(
                  "/app/chat/" +
                    conversation._id +
                    "&" +
                    (isGroupChat ? conversation.chatName : chatUser.name)
                );
              }}
            >
              <p className={"conIcon" + (isLight ? "" : " conIconDark")}>
                {isGroupChat ? conversation.chatName[0] : chatUser.name[0]}
              </p>
              <p className={"conTitle" + (isLight ? "" : " conTitleDark")}>
                {isGroupChat ? conversation.chatName : chatUser.name}
              </p>

              <p className="conLastMessage">
                {conversation.latestMessage.content}
              </p>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Conversation;
