import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { messageDB } from "../../../../../../firebase";

//route that initiates a chat between two users(nectar and bee)
export async function POST(request) {
  try {
    //get user receiver and sender data from frontend
    const { senderId, receiverId, senderName, receiverName } =
      await request.json();
    //create a unique chat key to ensure a new chat isn't created
    //for an existing chat
    const chatKeyId = [senderId, receiverId].sort().join("-");
    var chatId;
    //query the chats collection to locate if chatKeyId exists
    const q = query(
      collection(messageDB, "chats"),
      where("chatKeyId", "==", chatKeyId)
    );
    const snapshotData = await getDocs(q);
    //check if document size is 0
    if (snapshotData.size === 0) {
      //initiate chat, chat id does not exist
      const chat = await addDoc(collection(messageDB, "chats"), {
        users: [senderId, receiverId],
        senderName,
        receiverName,
        receiverId,
        senderId,
        createdAt: serverTimestamp(),
        chatKeyId,
      });
      chatId = chat.id;
      return NextResponse.json(
        {
          message: "Chat id created for message process.",
          chatId,
        },
        { status: 200 }
      );
    } else {
      //chat id already exists
      chatId = snapshotData.docs[0].id;
    }
    //send chat id to frontend
    return NextResponse.json(
      {
        message: "Chat id found for message process.",
        chatId,
      },
      { status: 200 }
    );
  } catch (err) {
    //All other errors
    return NextResponse.json(
      {
        message: "Server Error.",
      },
      { status: 500 }
    );
  }
}
