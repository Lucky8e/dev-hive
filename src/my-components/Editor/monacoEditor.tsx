"use client";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
type MonacoEditorProps = {
  value: string;
  onChange: (value: string | undefined) => void;
};

const MonacoEditor = ({ value, onChange }: MonacoEditorProps) => {
  return (
    <div className="h-full w-full">
      <Editor
        height={"100%"}
        width={"100%"}
        defaultLanguage="javascript"
        defaultValue="Hello World"
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          fontFamily: "JetBrains mono, monospace",
          fontSize: 16,
          fontLigatures: true
        }}
      />
    </div>
  );
};
export default MonacoEditor;
