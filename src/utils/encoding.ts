import iconv from "iconv-lite";

/**
 * 将字符串转换为 GBK 编码的 Buffer
 */
export function convertToGBK(text: string): Buffer {
  return iconv.encode(text, "gbk");
}

/**
 * 将 GBK 编码的 Buffer 转换为字符串
 */
export function convertFromGBK(buffer: Buffer): string {
  return iconv.decode(buffer, "gbk");
}

/**
 * 检测文件编码
 */
export function detectEncoding(buffer: Buffer): string {
  // 检查 BOM
  if (buffer.length >= 3) {
    if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
      return "UTF-8";
    }
  }

  if (buffer.length >= 2) {
    if (buffer[0] === 0xff && buffer[1] === 0xfe) {
      return "UTF-16LE";
    }
    if (buffer[0] === 0xfe && buffer[1] === 0xff) {
      return "UTF-16BE";
    }
  }

  // 尝试解码为 UTF-8
  try {
    const text = buffer.toString("utf-8");
    // 检查是否有无效字符
    if (!/\uFFFD/.test(text)) {
      return "UTF-8";
    }
  } catch (e) {
    // UTF-8 解码失败
  }

  // 尝试解码为 GBK
  try {
    const text = iconv.decode(buffer, "gbk");
    if (text.length > 0) {
      return "GBK";
    }
  } catch (e) {
    // GBK 解码失败
  }

  return "Unknown";
}

/**
 * 确保文本是 GBK 编码
 */
export function ensureGBK(input: string | Buffer): Buffer {
  if (Buffer.isBuffer(input)) {
    const encoding = detectEncoding(input);
    if (encoding === "GBK") {
      return input;
    }
    // 转换为字符串再转为 GBK
    const text = input.toString("utf-8");
    return convertToGBK(text);
  }
  return convertToGBK(input);
}
