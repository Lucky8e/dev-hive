"use client";
import MonacoEditor from "@/my-components/Editor/monacoEditor";
import NavBar from "@/my-components/Editor/NavBar";
import { useCallback, useEffect, useRef, useState } from "react";
import { Panel, Group, Separator } from "react-resizable-panels";
import Terminal from "@/my-components/Editor/Terminal";
import { runJavaScript } from "@/lib/codeRunner";
import ActiveUsers from "@/my-components/Editor/ActiveUsers";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import { getLatestCode, saveCode } from "@/lib/codeSyncServices";
import { supabase } from "@/lib/supabase";
import { debounce } from "lodash";

export default function WorkspaceIdPage() {
  const [code, setCode] = useState("console.log('Hello world')");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string | null>(null);

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
  return (
    <div className="flex flex-col h-screen w-full">
      <div className="h-16">
        <NavBar onRun={handleOnRun} isRunning={isRunning} />
        {/* --------------------Below Navbar content-----------------*/}
      </div>
      <div className="flex-1 min-h-0 flex px-2">
        {/*------------------- Room Participants Section -------------------------*/}
        <div className="w-65 bg-black">
          {roomId && userId && <ActiveUsers roomId={roomId} userId={userId} />}
        </div>
        {/*------------------ Editor and Terminal Section  ------------------------*/}

        <div className="flex flex-1 min-h-0">
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
        <div className="w-100 bg-amber-400"></div>
      </div>
    </div>
  );
}
