import fs from "fs";
import path from "path";
import { expect } from "chai";
import { fileURLToPath } from "url";
import MultipartParser from "../index.js";

// Helper to get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("MultipartParser", () => {
  it("should parse multipart form data", (done) => {
    const boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
    const buffer = Buffer.from(
      `------${boundary}\r\n` +
        `Content-Disposition: form-data; name="field1"\r\n\r\n` +
        `value1\r\n` +
        `------${boundary}\r\n` +
        `Content-Disposition: form-data; name="file"; filename="test.txt"\r\n` +
        `Content-Type: text/plain\r\n\r\n` +
        `Hello World\r\n` +
        `------${boundary}--\r\n`
    );

    const req = {
      headers: {
        "content-type": `multipart/form-data; boundary=${boundary}`,
      },
      on: function (event, callback) {
        if (event === "data") callback(buffer);
        if (event === "end") callback();
      },
    };

    const parser = new MultipartParser(boundary);
    parser.parse(req, (err, result) => {
      expect(err).to.be.null;
      expect(result.fields.field1).to.equal("value1");
      expect(result.files.length).to.equal(1);
      expect(result.files[0].name).to.equal("file");
      expect(fs.readFileSync(result.files[0].path, "utf8")).to.equal(
        "Hello World"
      );
      fs.unlinkSync(result.files[0].path);
      done();
    });
  });
});
