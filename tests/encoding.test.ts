import { describe, it, expect } from "vitest";
import { convertToGBK, convertFromGBK, detectEncoding } from "../src/utils/encoding";

describe("Encoding Utils", () => {
  describe("convertToGBK", () => {
    it("should convert Chinese text to GBK", () => {
      const text = "测试文本";
      const buffer = convertToGBK(text);
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it("should handle empty string", () => {
      const buffer = convertToGBK("");
      expect(buffer.length).toBe(0);
    });
  });

  describe("convertFromGBK", () => {
    it("should convert GBK buffer to text", () => {
      const originalText = "角色配置";
      const buffer = convertToGBK(originalText);
      const text = convertFromGBK(buffer);
      expect(text).toBe(originalText);
    });
  });

  describe("detectEncoding", () => {
    it("should detect UTF-8 BOM", () => {
      const buffer = Buffer.from([0xef, 0xbb, 0xbf, 0x61, 0x62, 0x63]);
      const encoding = detectEncoding(buffer);
      expect(encoding).toBe("UTF-8");
    });

    it("should detect GBK encoding", () => {
      const text = "中文";
      const buffer = convertToGBK(text);
      const encoding = detectEncoding(buffer);
      expect(encoding).toBe("GBK");
    });
  });
});
