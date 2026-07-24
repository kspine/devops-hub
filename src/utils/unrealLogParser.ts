export const UnrealLogParser = {
  parse: (logContent: string) => {
    const patterns = [
      { type: "error", regex: /Error: (.*)/, msg: "UBT Build Error: $1" },
      { type: "error", regex: /Cook failure: (.*)/, msg: "Cooking Failure: $1" },
      { type: "warning", regex: /Warning: (.*)/, msg: "UBT Warning: $1" }
    ];

    const lines = logContent.split("\n");
    const parsed = [];

    for (const line of lines) {
      for (const pattern of patterns) {
        const match = line.match(pattern.regex);
        if (match) {
          parsed.push({
            type: pattern.type,
            msg: pattern.msg.replace("$1", match[1]),
            msgZh: pattern.msg.replace("$1", match[1]) // Simplified
          });
          break;
        }
      }
    }
    return parsed;
  }
};
