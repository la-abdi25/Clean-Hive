"use client";
import "../styles/MessagingDashBoard.css";
import { useState, useEffect, useRef } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  getDocs,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { messageDB } from "../../firebase";
import toast, { Toaster } from "react-hot-toast";
import { nanoid } from "nanoid";
import { useParams } from "next/navigation";
import axios from "axios";
import LoadingSmall from "./LoadingSmall";
import { useRouter } from "next/navigation";
import { myPromise } from "../../firebase";
//component for bee/customer to interact with nectar/cleaning agent
const MessagingDashBoard = () => {
  const [sentMessage, setSentMessage] = useState("");
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("");
  const [chatId, setChatId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const bottomDiv = useRef(null);
  const router = useRouter();
  //handle anonymous sign in Firebase
  useEffect(() => {
    const handleAuth = async () => {
      try {
        const user = await myPromise;
      } catch (err) {
        console.log("Auth error:", err);
      }
    };
    handleAuth();
  }, []);
  //Loading Component fetching data from API
  useEffect(() => {
    let timer = "";
    if (isLoading) {
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }
    //cleanup
    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);

  //fetches currently logged in bee user
  var params = useParams();
  useEffect(() => {
    const handleUser = async () => {
      const userId = params.id;
      setUser(userId);
      if (userId) {
        try {
          const res = await axios.get(
            `/api/users/bee-profile/bee-data/${userId}`
          );
        } catch (err) {
          if (err.response.data.idExists === false) {
            router.push("/not-found");
          } else {
            console.log(err);
          }
        }
      }
    };
    handleUser();
  }, []);

  useEffect(() => {
    const getMyChats = async () => {
      //reference chats collection
      const chats = collection(messageDB, "chats");
      //locate logged in user chats
      const q = query(chats, where("users", "array-contains", user));
      const allChats = await getDocs(q);
      //get all associated chats
      const chatsAll = allChats.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return chatsAll;
    };
    //list of all people user had conversations with
    const getConversationList = async () => {
      const currentChats = await getMyChats();
      const otherUsers = currentChats.map((chat) => {
        const otherPerson = chat.users.find((id) => id !== user);
        return {
          otherUserId: otherPerson,
          senderId: user,
          chatId: chat.id,
        };
      });
      //locate names of users conversing with
      const findNames = async () => {
        const data = [];
        for (const user of otherUsers) {
          const id = user.otherUserId;
          if (id) {
            const res = await axios.get(
              `/api/users/nectar-profile/nectar-data/${id}`
            );
            if (res.data.nectarData.firstName) {
              data.push({ ...user, firstName: res.data.nectarData.firstName });
            }
          }
        }
        return data;
      };
      //conversations points to names of all other users conversing with
      const convos = await findNames();
      setConversations(convos);
    };
    getConversationList();
  }, [user]);
  //user requests to send a message to nectar/cleaning agent
  const handleMessage = async () => {
    try {
      if (!sentMessage) {
        toast.error("Please enter a message.", { position: "top-right" });
      } else {
        setLoadingMessage(true);
        await addDoc(collection(messageDB, "chats", chatId, "messages"), {
          message: sentMessage,
          senderId: user,
          sent: new Date(),
          receiverId,
          createdAt: serverTimestamp(),
        });
        setTimeout(() => {
          setLoadingMessage(false);
        }, 1000);
        setSentMessage("");
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    //get messages associated with logged in user for this chatid
    if (!chatId) {
      return;
    }
    //reference chats collection
    const messages = collection(messageDB, "chats", chatId, "messages");
    //locate logged in user chats
    const q = query(messages, orderBy("createdAt", "asc"));
    const messageAll = onSnapshot(q, (snapshot) => {
      const messagesNow = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesNow);
    });
    return () => {
      messageAll();
    };
  }, [chatId]);
  //scroll to current message at the bottom
  useEffect(() => {
    if (bottomDiv.current) {
      bottomDiv.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <section className="MessagingDashBoard1">
      <h2>My Messages</h2>
      <div>
        <Toaster />
      </div>
      <div className="MessagingDashBoard">
        <div className="Messaging-Conversations">
          <div className="Conversations">
            <h4>My Conversations</h4>
          </div>
          {isLoading ? (
            <LoadingSmall />
          ) : (
            <div>
              {conversations.length > 0 && (
                <div className="Conversations-List">
                  {conversations.map((convo) => {
                    return (
                      <p
                        onClick={() => {
                          setChatId(convo.chatId);
                          setReceiverId(convo.otherUserId);
                        }}
                        key={nanoid()}
                      >
                        {convo.firstName}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="Messaging-Dialog">
          <div className="Messaging-Now">
            {chatId ? (
              <>
                {messages.map((message) => {
                  return (
                    <div key={nanoid()}>
                      {message.senderId === user ? (
                        <div className="Sent-Conversations">
                          <div className="Full-Message">
                            <p>{message.message} </p>
                            <div className="Message-TimeStamp">
                              {message.sent.toDate().toLocaleString("en-US", {
                                month: "short",
                                weekday: "short",
                                year: "numeric",
                                day: "2-digit",
                              })}{" "}
                              at{" "}
                              {message.sent.toDate().toLocaleString("en-US", {
                                timeStyle: "short",
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="Received-Conversations">
                          <div className="Full-Message">
                            <p>{message.message} </p>
                            <div className="Message-TimeStamp">
                              {message.sent.toDate().toLocaleString("en-US", {
                                month: "short",
                                weekday: "short",
                                year: "numeric",
                                day: "2-digit",
                              })}{" "}
                              at{" "}
                              {message.sent.toDate().toLocaleString("en-US", {
                                timeStyle: "short",
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="Intro-Convo">
                <p>Click on names to view your conversations.</p>
              </div>
            )}
            <div ref={bottomDiv}></div>
          </div>

          {chatId && (
            <div className="Send-Message">
              <input
                type="text"
                name="send"
                placeholder="Enter your message here..."
                value={sentMessage}
                onChange={(e) => {
                  setSentMessage(e.target.value);
                }}
              />

              <button
                className="Send-Button"
                onClick={handleMessage}
                disabled={loadingMessage}
              >
                {loadingMessage ? "Sending..." : "Send"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
export default MessagingDashBoard;
