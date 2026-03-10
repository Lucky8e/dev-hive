"use client";
import MonacoEditor from "@/my-components/Editor/monacoEditor";
import NavBar from "@/my-components/Editor/NavBar";
import { useCallback, useEffect, useRef, useState } from "react";
import { Panel, Group, Separator } from "react-resizable-panels";
import Terminal from "@/my-components/Editor/Terminal";
import { runJavaScript } from "@/lib/codeRunner";
import ActiveUsers from "@/my-components/Editor/ActiveUsers";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";
import { getLatestCode, saveCode } from "@/lib/codeSyncServices";
import { supabase } from "@/lib/supabase";
import { debounce } from "lodash";
import ChatComponent from "@/my-components/Editor/ChatComponent";
import { Button } from "@/components/ui/button";
import { Copy, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Separator as ShadSeparator } from "@/components/ui/separator";
import { markUsersInactive } from "@/lib/userPresenceService";

export default function WorkspaceIdPage() {
  const [code, setCode] = useState("console.log('Hello world')");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string | null>(null);

  const router = useRouter();

  const isRemoteUpdate = useRef(false);

  const params = useParams();

  const roomCode = params.workspaceId?.toString();
  const userName = Cookies.get("userName");
  const userId = Cookies.get("userId");

  useEffect(() => {
    const id = Cookies.get("roomId") || null;
    setRoomId(id);
  }, []);

  //--------------------Get latest code--------------------//
  useEffect(() => {
    if (!roomId) return;
    const fetchCode = async () => {
      const codeResult = await getLatestCode(roomId);
      if (codeResult.success && codeResult.code) {
        setCode(codeResult.code);
      }
    };
    fetchCode();
  }, [roomId]);

  //----------Subscribe to real-time code changes----------//
  useEffect(() => {
    if (!roomId) return;
    const channel = supabase
      .channel(`room:${roomId}:code`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "code_snapshots",
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          isRemoteUpdate.current = true;
          setCode(payload.new.code);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  //---------------Create a debounce function----------------//
  const debounceSave = useCallback(
    debounce(async (code: string) => {
      if (roomId) {
        await saveCode({ roomId, code });
      }
    }, 2000),
    [roomId]
  );

  //---------------Handle the code change----------------//
  const handleCodeChange = (newCode: string | undefined) => {
    const value = newCode ?? "";

    if (isRemoteUpdate.current === true) {
      isRemoteUpdate.current = false;
      return;
    }
    setCode(value);
    debounceSave(value);
  };

  //---------------Handle the code running----------------//
  const handleOnRun = async () => {
    setIsRunning(true);
    setOutput("");
    setError(null);

    const result = await runJavaScript(code);

    setOutput(result.output);
    setError(result.error);
    setIsRunning(false);
  };
  //---------------Handle the Leaving Room----------------//
  const handleLeaveRoom = async () => {
    if (userId && roomId) {
      await markUsersInactive(userId, roomId);
    }
    //Clear the cookies
    Cookies.remove("userId");
    Cookies.remove("userName");
    Cookies.remove("roomCode");
    Cookies.remove("roomId");

    router.push("/join-room");
  };
  return (
    <div className="flex flex-col h-screen w-full">
      <div className="h-16">
        {userId && userName && (
          <NavBar
            onRun={handleOnRun}
            isRunning={isRunning}
            userId={userId}
            userName={userName}
          />
        )}
        {/* --------------------Below Navbar content-----------------*/}
      </div>
      <div className="flex-1 min-h-0 flex">
        {/*------------------- Room Participants Section -------------------------*/}
        <div className="w-65 flex flex-col bg-black">
          <div className="flex-1">
            {roomId && userId && (
              <ActiveUsers roomId={roomId} userId={userId} />
            )}
          </div>
          <div className="p-3 border-t border-primary bg-background">
            <p className="text-lg font-bold text-muted-foreground">Room Code</p>
            <div className="flex items-center justify-between border border-slate-700 p-2 rounded-lg mt-1">
              <p className="text-sm font-semibold font-mono">{roomCode}</p>
              <Button
                size={"icon"}
                className="border-2 border-green-700 bg-green-600/30 
                hover:bg-green-300 text-emerald-600 
                transition-colors duration-300"
                onClick={() => {
                  navigator.clipboard.writeText(roomCode ?? "");
                  toast.success("Room Code Copied");
                }}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <ShadSeparator className="mt-2 mb-2" />
            <Button
              className="bg-red-500/15 w-full text-red-600
             hover:bg-red-300 border-2 border-red-700
              h-12 font-bold transition-colors duration-300"
              onClick={handleLeaveRoom}
            >
              <LogOut className="w-4 h-4" strokeWidth={3} />
              Leave Room
            </Button>
          </div>
        </div>
        {/*------------------ Editor and Terminal Section  ------------------------*/}

        <div className="flex flex-1 min-h-0 border-r border-l-2 border-slate-700 ">
          <Group orientation={"vertical"} className="h-full flex-1">
            <Panel defaultSize={"70%"} minSize={"200px"}>
              <MonacoEditor value={code} onChange={handleCodeChange} />
            </Panel>
            <Separator />
            <Panel defaultSize={"30%"} minSize={"100px"}>
              <Terminal output={output} error={error} isRunning={isRunning} />
            </Panel>
          </Group>
        </div>

        {/*-------------------- Chat Section------------------- */}
        <div className="w-100">
          {roomId && userId && userName && (
            <ChatComponent
              roomId={roomId}
              userId={userId}
              userName={userName}
            />
          )}
        </div>
      </div>
    </div>
  );
}
