"use client";
import { useState } from "react";
import JoinForm from "../../my-components/Form/JoinForm";

interface User {
  id: string;
  name: string;
}
interface Room {
  id: string;
  code: string;
}

const JoinRoomPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [room, setRoom] = useState<Room | null>(null);

  // This is the onJoin function
  const handleJoin = (userData: User, roomData: Room) => {
    setUser(userData); // Save user to state
    setRoom(roomData); // Save room to state
  };
  return (
    <div>
      <JoinForm onJoin={handleJoin} />
    </div>
  );
};
export default JoinRoomPage;
