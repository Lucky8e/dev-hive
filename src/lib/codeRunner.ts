export const runJavaScript = async (
  code: string
): Promise<{
  output: string;
  error: string | null;
}> => {
  try {
    const logs: string[] = [];

    const customConsole = {
      log: (...args: any[]) => {
        logs.push(
          args
            .map((arg) =>
              typeof arg === "object"
                ? JSON.stringify(arg, null, 2)
                : String(arg)
            )
            .join(" ")
        );
      },
      error: (...args: any[]) => {
        logs.push("ERROR: " + args.map(String).join(" "));
      },
      warn: (...args: any[]) => {
        logs.push("WARNING" + args.map(String).join(" "));
      }
    };

    const func = new Function("console", code);
    func(customConsole);
    return {
      output: logs.join("\n") || "//Code executed successfully (no output)",
      error: null
    };
  } catch (error: any) {
    return {
      output: "",
      error: `Error: ${error.message}`
    };
  }
};
