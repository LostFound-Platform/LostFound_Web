import { HubConnectionBuilder } from "@microsoft/signalr";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import axiosInstance from "../api/axiosInstance";

export default function Chat() {
  // Variables
  const [chats, setChats] = useState([]);
  const [messagesFromChat, setMessagesFromChat] = useState([]);
  const [temporaryListChat, setTemporaryListChat] = useState([]);
  const [chat, setChat] = useState({
    chatId: 0,
    urlAvatar: "",
    fullName: "",
    userReceiveId: 0,
    postId: 0,
  });
  const [user, setUser] = useState("");
  const [sendStatus, setSendStatus] = useState("Sending");
  const [userSendId, setUserSendId] = useState("");
  const [message, setMessage] = useState("");
  const [temporaryChat, setTemporaryChat] = useState("");
  const [isMoveToDetailsChat, setIsMoveToDetailsChat] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSentTempMessage, setIsSentTempMessage] = useState(false);
  const [isInProcessing, setIsInProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const chatBodyRef = useRef(null);

  // Functions
  // Get my profile
  const getMyProfile = async () => {
    setIsInProcessing(true);

    try {
      const response = await axiosInstance.get("/Users/profile", {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404,
      });

      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || "Server error";

        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: message,
              status: "error",
            },
          }),
        );
      } else if (error.request) {
        // If offline
        if (!navigator.onLine) {
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message: "Network error. Please check your internet connection",
                status: "error",
              },
            }),
          );
        } else {
          // Server offline
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message:
                  "Server is currently unavailable. Please try again later.",
                status: "error",
              },
            }),
          );
        }
      } else {
        // Other errors
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "Something went wrong. Please try again",
              status: "error",
            },
          }),
        );
      }
    } finally {
      setIsInProcessing(false);
    }
  };

  // Handle send message
  const handleSendMessage = async () => {
    // // Add temporary message for good ux
    // setMessagesFromChat((prev) => {
    //   return [
    //     ...prev,
    //     {
    //       messageChatId: Math.random(),
    //       messageContent: message,
    //       userSenderId: user.userId,
    //     },
    //   ];
    // });

    setIsSentTempMessage(true);
    setIsSending(true);
    if (temporaryChat) {
      setTemporaryListChat((prev) => [...prev, message]);
    }
    setSendStatus("Sending");

    const payload = {
      messageChatId: 0,
      chatId: temporaryChat.chatId ? temporaryChat.chatId : chat.chatId,
      userAId: temporaryChat.userIdSend
        ? temporaryChat.userIdSend
        : user.userId,
      userBId: temporaryChat.userIdReceive
        ? temporaryChat.userIdReceive
        : chat.userReceiveId,
      postId: temporaryChat.postId ? temporaryChat.postId : chat.postId,
      userSenderId: 0,
      messageContent: message,
    };

    try {
      const response = await axiosInstance.post("/MessageChat", payload, {
        headers: {
          "Content-Type": "application/json",
        },
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404 || status === 403,
      });
      if (response.status === 200) {
        // Reset message
        setMessage("");

        setSendStatus("Sent");
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: response.data?.message,
              status: "success",
            },
          }),
        );
      }
      if (response.status === 403) {
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "Please verify your email address to continue",
              status: "warning",
            },
          }),
        );
      }

      if (response.status === 401) {
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "Please sign in to continue",
              status: "warning",
            },
          }),
        );
      }
    } catch (error) {
      setSendStatus("Failed");

      if (error.response) {
        const message = error.response.data?.message || "Server error";

        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: message,
              status: "error",
            },
          }),
        );
      } else if (error.request) {
        // If offline
        if (!navigator.onLine) {
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message: "Network error. Please check your internet connection",
                status: "error",
              },
            }),
          );
        } else {
          // Server offline
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message:
                  "Server is currently unavailable. Please try again later.",
                status: "error",
              },
            }),
          );
        }
      } else {
        // Other errors
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "Something went wrong. Please try again",
              status: "error",
            },
          }),
        );
      }
    } finally {
      setIsSending(false);
      setMessage("");
    }
  };

  // Handle get all chats
  const handleGetAllChats = async () => {
    setIsSending(true);
    setIsLoading(true);

    try {
      const response = await axiosInstance.get("/MessageChat/my-chats", {
        headers: {
          "Content-Type": "applications/json",
        },
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404 || status === 403,
      });

      if (response.status === 200) {
        setChats(response.data);
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || "Server error";

        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: message,
              status: "error",
            },
          }),
        );
      } else if (error.request) {
        // If offline
        if (!navigator.onLine) {
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message: "Network error. Please check your internet connection",
                status: "error",
              },
            }),
          );
        } else {
          // Server offline
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message:
                  "Server is currently unavailable. Please try again later.",
                status: "error",
              },
            }),
          );
        }
      } else {
        // Other errors
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "Something went wrong. Please try again",
              status: "error",
            },
          }),
        );
      }
    } finally {
      setIsSending(false);
      setIsLoading(false);
    }
  };

  // Handle get all messages by chat id
  const handleGetAllMessagesByChatId = async (chatId) => {
    setIsSending(true);

    try {
      const response = await axiosInstance.get(`/MessageChat/chat/${chatId}`, {
        headers: {
          "Content-Type": "applications/json",
        },
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404 || status === 403,
      });

      if (response.status === 200) {
        setSendStatus("Sent");
        setMessagesFromChat(response.data);
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || "Server error";

        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: message,
              status: "error",
            },
          }),
        );
      } else if (error.request) {
        // If offline
        if (!navigator.onLine) {
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message: "Network error. Please check your internet connection",
                status: "error",
              },
            }),
          );
        } else {
          // Server offline
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message:
                  "Server is currently unavailable. Please try again later.",
                status: "error",
              },
            }),
          );
        }
      } else {
        // Other errors
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "Something went wrong. Please try again",
              status: "error",
            },
          }),
        );
      }
    } finally {
      setIsSending(false);
    }
  };

  // Realtime
  const connectToSignalR = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const connection = new HubConnectionBuilder()
        .withUrl(
          "https://lost-and-found-cqade7hfbjgvcbdq.centralus-01.azurewebsites.net/SystemHub",
          {
            // withCredentials: true,
            accessTokenFactory: () => token,
          },
        )
        .withAutomaticReconnect()
        .build();

      // Listen event from backend
      // Get new message
      connection.on("ReceiveNewMessage", (data) => {
        console.log(JSON.stringify(data.message));
        setMessagesFromChat((prev) => {
          if (
            prev.some((m) => m.messageChatId === data.message.messageChatId)
          ) {
            return prev;
          }
          return [...prev, data.message];
        });

        // Play audio sound when receive new chat
        const audioNewMessageReceive = new Audio("/Sounds/news-ting.mp3");
        audioNewMessageReceive.volume = 0.3;
        audioNewMessageReceive
          .play()
          .catch(() => console.log("Unable to play audio."));
      });

      // Get new chat
      connection.on("ReceiveNewChat", (data) => {
        // console.log(JSON.stringify(data.chat));
        setChats((prev) => {
          if (prev.some((c) => c.chatId === data.chat.chatId)) {
            return prev;
          }
          return [data.chat, ...prev];
        });

        // Play audio sound when receive new chat
        const audioNewMessageReceive = new Audio("/Sounds/news-ting.mp3");
        audioNewMessageReceive.volume = 0.3;
        audioNewMessageReceive
          .play()
          .catch(() => console.log("Unable to play audio."));
      });

      // Start realtime
      await connection.start();

      return () => {
        connection.stop(); // Ignore leaks memory
      };
    } catch (error) {
      console.log(error);
    }
  };

  // UseEffect
  useEffect(() => {
    handleGetAllChats();
    getMyProfile();
    connectToSignalR();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      // Load a chat clicked
      handleGetAllMessagesByChatId(selectedChat.chatId);
    }
  }, [selectedChat]);

  useEffect(() => {
    window.addEventListener("contact-owner", (event) => {
      if (chats.find((chat) => chat.postId === event.detail.postId)) {
        if (chatBodyRef.current) {
          document.getElementById("chatBody").style.transform =
            "translateX(-49%)";

          setSelectedChat(chat);
          setIsMoveToDetailsChat(true);
          setUserSendId(chat.userSendId);

          // Load a chat clicked
          handleGetAllMessagesByChatId(chat.chatId);
          setChat({
            urlAvatar:
              user.userId === chat.userAId
                ? chat.avatarUserB
                  ? chat.urlAvatarUserB
                  : "/Image/user_icon.png"
                : chat.avatarUserA
                  ? chat.urlAvatarUserA
                  : "/Image/user_icon.png",
            fullName:
              user.userId === chat.userAId
                ? `${chat.firstNameUserB} ${chat.lastNameUserB}`
                : `${chat.firstNameUserA} ${chat.lastNameUserA}`,
            userReceiveId: chat.userSenderId,
            chatId: chat.chatId,
            postId: chat.postId,
          });
        }
      } else {
        setTemporaryChat(event.detail);
      }

      setMessage(event.detail.message);
    });
  }, [temporaryChat, temporaryListChat]);

  return (
    <>
      <div className="chat-container">
        <div
          className="chat-bubble"
          id="chatBubble"
          onClick={() => {
            const chatBubble = document.getElementById("chatBubble");
            const chatPopup = document.getElementById("chatPopup");
            if (chatPopup.style.display === "flex") {
              chatPopup.style.display = "none";
            } else {
              chatPopup.style.display = "flex";
            }

            // Click outside to close
            document.addEventListener("click", (e) => {
              if (
                !chatBubble.contains(e.target) &&
                !chatPopup.contains(e.target)
              ) {
                chatPopup.style.display = "none";
              }
            });
          }}
        >
          <i className="fa-solid fa-message"></i>
          {/* <span className="chat-badge">2</span> */}
        </div>

        <div className="chat-popup" id="chatPopup">
          <div className="chat-header">Chats</div>
          <div
            className="chat-body"
            id="chatBody"
            style={{
              gridTemplateColumns: temporaryChat ? "auto" : "",
              width: temporaryChat ? "100%" : "",
            }}
          >
            <div className="chat-list">
              {temporaryChat ? (
                <div className="chat-details">
                  {/* HEADER */}
                  <div className="chat-details-header">
                    <img
                      src={
                        temporaryChat.avatar
                          ? temporaryChat.urlAvatar
                          : "/Image/user_icon.png"
                      }
                      loading="lazy"
                      className="avatar"
                    />
                    <span>
                      {temporaryChat.firstName} {temporaryChat.lastName}
                    </span>
                  </div>

                  {/* Body */}
                  {temporaryListChat.length > 0 && isSentTempMessage && (
                    <>
                      <div className="chat-details-body">
                        {temporaryListChat.map((item, idx) => (
                          <div key={idx}>
                            <div className={`message me`}>{item}</div>
                            <label
                              style={{
                                color:
                                  sendStatus === "Sent"
                                    ? "green"
                                    : sendStatus === "Failed"
                                      ? "red"
                                      : "",
                              }}
                            >
                              {sendStatus}
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="chat-details-footer">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();

                        handleSendMessage();
                      }}
                    >
                      <textarea
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                        }}
                        required
                      ></textarea>
                      <button
                        aria-label="Send message button"
                        disabled={isSending}
                      >
                        {isSending ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          <i className="fa-solid fa-paper-plane"></i>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              ) : isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    className=""
                    key={index}
                    style={{
                      padding: "10px",
                      marginBottom: "0px",
                      display: "flex",
                    }}
                  >
                    <Skeleton
                      height={50}
                      width={50}
                      style={{
                        marginBottom: "10px",
                        marginRight: "10px",
                        borderRadius: "50px",
                        marginTop: "10px",
                      }}
                    />
                    <div className="">
                      <Skeleton
                        count={3}
                        width={170}
                        height={20}
                        style={{ marginBottom: "3px" }}
                      />
                    </div>
                  </div>
                ))
              ) : chats.length === 0 ? (
                <div
                  className="chat-item"
                  style={{
                    backgroundColor: "transparent",
                    cursor: "default",
                    marginTop: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p>No chats yet</p>
                </div>
              ) : (
                chats.map((chat) => (
                  <div
                    className="chat-item"
                    key={chat.chatId}
                    onClick={() => {
                      document.getElementById("chatBody").style.transform =
                        "translateX(-49%)";

                      setSelectedChat(chat);
                      setIsMoveToDetailsChat(true);
                      setUserSendId(chat.userSendId);

                      setChat({
                        urlAvatar:
                          user.userId === chat.userAId
                            ? chat.avatarUserB
                              ? chat.urlAvatarUserB
                              : "/Image/user_icon.png"
                            : chat.avatarUserA
                              ? chat.urlAvatarUserA
                              : "/Image/user_icon.png",
                        fullName:
                          user.userId === chat.userAId
                            ? `${chat.firstNameUserB} ${chat.lastNameUserB}`
                            : `${chat.firstNameUserA} ${chat.lastNameUserA}`,
                        userReceiveId: chat.userSenderId,
                        chatId: chat.chatId,
                        postId: chat.postId,
                      });
                    }}
                  >
                    <img
                      src={
                        user.userId === chat.userAId
                          ? chat.avatarUserB
                            ? chat.urlAvatarUserB
                            : "/Image/user_icon.png"
                          : chat.avatarUserA
                            ? chat.urlAvatarUserA
                            : "/Image/user_icon.png"
                      }
                      alt="Avatar"
                      loading="lazy"
                      className="avatar"
                    />
                    <div className="chat-info">
                      <div className="chat-name">
                        {user.userId === chat.userAId
                          ? `${chat.firstNameUserB} ${chat.lastNameUserB}`
                          : `${chat.firstNameUserA} ${chat.lastNameUserA}`}
                      </div>
                      <div className="chat-message">
                        {user.userId === chat.userSendId ? (
                          `You: ${(
                            <ReactMarkdown
                              children={chat.messageContent}
                              rehypePlugins={[rehypeRaw, rehypeSanitize]}
                            ></ReactMarkdown>
                          )}`
                        ) : (
                          <ReactMarkdown
                            children={chat.messageContent}
                            rehypePlugins={[rehypeRaw, rehypeSanitize]}
                          ></ReactMarkdown>
                        )}
                      </div>
                      <div className="chat-time">
                        <a
                          href={`/detail-post/${chat.postId}`}
                          className="chat-post-title"
                        >
                          Item: {chat.title}
                        </a>
                        {dayjs(chat.dateSendMessage).format("MM/DD/YYYY")}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Detail chat */}
            {isMoveToDetailsChat && selectedChat && (
              <div className="chat-details" ref={chatBodyRef}>
                {/* HEADER */}
                <div className="chat-details-header">
                  <i
                    className="fa-solid fa-arrow-left"
                    style={{ marginLeft: "10px" }}
                    onClick={(e) => {
                      e.stopPropagation();

                      document.getElementById("chatBody").style.transform =
                        "translateX(0)";
                      setIsMoveToDetailsChat(false);
                    }}
                  ></i>
                  <img
                    src={
                      chat.urlAvatar ? chat.urlAvatar : "/Image/user_icon.png"
                    }
                    loading="lazy"
                    className="avatar"
                  />
                  <span>{chat.fullName}</span>
                </div>

                {/* Body detail chat*/}
                <div className="chat-details-body">
                  {messagesFromChat.map((msg) => (
                    <div key={msg.messageChatId}>
                      <div
                        className={`message ${
                          user.userId === msg.userSenderId ? "me" : "other"
                        }`}
                      >
                        {msg.messageContent}
                      </div>

                      {/* Status sending */}
                      {messagesFromChat.at(-1) &&
                        user.userId ===
                          messagesFromChat[messagesFromChat.length - 1]
                            .userSenderId && (
                          <label
                            style={{
                              color:
                                sendStatus === "Sent"
                                  ? "green"
                                  : sendStatus === "Failed"
                                    ? "red"
                                    : "",
                            }}
                          >
                            {sendStatus}
                          </label>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {isMoveToDetailsChat && selectedChat && (
            <div className="chat-details-footer">
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  handleSendMessage();
                }}
              >
                <textarea
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  required
                ></textarea>
                <button aria-label="Send message button" disabled={isSending}>
                  {isSending ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fa-solid fa-paper-plane"></i>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
