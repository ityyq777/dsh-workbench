/**
 * 宿主 ↔ Electron helper 的通信协议：stdin/stdout 上每行一个 JSON。
 * 纯文本行，不依赖任何 IPC 库；helper 侧同样实现一遍。
 */

export function encodeLine(message) {
  return JSON.stringify(message) + "\n";
}

/** 逐行解析；坏行直接跳过并交给 onBadLine，不让一条脏数据打断整条通道。 */
export function createLineReader(stream, onMessage, onBadLine) {
  let buffer = "";
  if (!stream) return function () {};
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => {
    buffer += chunk;
    let index = buffer.indexOf("\n");
    while (index >= 0) {
      const line = buffer.slice(0, index).trim();
      buffer = buffer.slice(index + 1);
      index = buffer.indexOf("\n");
      if (!line) continue;
      try {
        onMessage(JSON.parse(line));
      } catch (error) {
        if (typeof onBadLine === "function") onBadLine(line, error);
      }
    }
    if (buffer.length > 1024 * 1024) buffer = "";
  });
  return function () {
    buffer = "";
  };
}

export const PROTOCOL_VERSION = 1;
