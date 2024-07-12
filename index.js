import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MultipartParser {
  constructor(boundary) {
    this.boundary = `--${boundary}`;
    this.files = [];
    this.fields = {};
  }

  parse(req, callback) {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const buffer = Buffer.concat(chunks);
      this._parseBuffer(buffer);
      callback(null, { files: this.files, fields: this.fields });
    });
  }

  _parseBuffer(buffer) {
    const parts = buffer.toString().split(this.boundary);
    parts.forEach((part) => {
      if (part.length === 0 || part === "--\r\n") return;

      const headerEnd = part.indexOf("\r\n\r\n");
      const headers = part.slice(0, headerEnd).toString();
      let content = part.slice(headerEnd + 4, part.length - 2).toString(); // Remove trailing \r\n

      // Trim trailing boundary marker for the last field
      if (content.endsWith("\r\n--")) {
        content = content.slice(0, -4);
      } else if (content.endsWith("\r\n")) {
        content = content.slice(0, -2);
      }

      if (headers.includes('Content-Disposition: form-data; name="')) {
        const nameMatch = headers.match(/name="(.+?)"/);
        const filenameMatch = headers.match(/filename="(.+?)"/);
        if (filenameMatch) {
          const filename = filenameMatch[1];
          const filePath = path.join(__dirname, "..", "uploads", filename);
          fs.writeFileSync(filePath, content);
          this.files.push({ name: nameMatch[1], path: filePath });
        } else {
          this.fields[nameMatch[1]] = content.trim(); // Trim to remove any trailing whitespace
        }
      }
    });
  }
}

export default MultipartParser;
