import { SquareTerminal } from "lucide-react";

interface TerminalProps {
  output: string;
  error: string | null;
  isRunning: boolean;
}
const Terminal = ({ output, error, isRunning }: TerminalProps) => {
  return (
    <div className="h-full w-full bg-slate-950 p-4 overflow-auto font-mono text-sm capitalize">
      {/*------------------Header---------------*/}
      <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-slate-800">
        <div className="flex items-center gap-2">
          <SquareTerminal className="w-4 h-4 text-green-500" />
          <h3 className="text-green-500 font-semibold">Output</h3>
        </div>
        {isRunning && (
          <span className="text-yellow-400 text-xs animate-pulse">
            Running...
          </span>
        )}
      </div>
      {/*------------------Output---------------*/}
      <div className="text-xs">
        {error ? (
          <pre className="text-red-600 whitespace-pre-wrap">
            {"> "}
            {error}
          </pre>
        ) : output ? (
          <pre className="text-green-300 whitespace-pre-wrap">
            {"> "}
            {output}
          </pre>
        ) : (
          <div>Click "Run Code" to see the output here</div>
        )}
      </div>
    </div>
  );
};
export default Terminal;
