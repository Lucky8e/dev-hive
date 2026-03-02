import { cookies } from "next/headers";
import JoinRoomPage from "./join-room/page";

const page = async () => {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId");
};
export default page;
