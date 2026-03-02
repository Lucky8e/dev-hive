"use client";
import MonacoEditor from "@/my-components/Editor/monacoEditor";
import NavBar from "@/my-components/Editor/NavBar";
import { useState } from "react";
import { Panel, Group, Separator } from "react-resizable-panels";
import Terminal from "@/my-components/Editor/Terminal";
import { runJavaScript } from "@/lib/codeRunner";

export default function Home() {
  const [code, setCode] = useState("console.log('Hello world')");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

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
        {/*------------------- Left Section -------------------------*/}
        <div className="w-65 bg-black"></div>
        {/*------------------ Middle Section  ------------------------*/}

        <div className="flex flex-1 min-h-0">
          <Group orientation={"vertical"} className="h-full flex-1">
            <Panel defaultSize={"70%"} minSize={"200px"}>
              <MonacoEditor
                value={code}
                onChange={(code) => setCode(code || "")}
              />
            </Panel>
            <Separator />
            <Panel defaultSize={"30%"} minSize={"100px"}>
              <Terminal output={output} error={error} isRunning={isRunning} />
            </Panel>
          </Group>
        </div>

        {/*-------------------- Right Section------------------- */}
        <div className="w-100 bg-amber-400"></div>
      </div>
    </div>
  );
}
