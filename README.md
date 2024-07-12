# upmulp

Inspired from not being able to use multer or busboy in a recent project. A custom multipart form data parser for Node.js. This package helps you parse multipart form data in Node.js applications, allowing you to handle file uploads and form fields with ease.

## Features

- Parses multipart form data
- Handles file uploads
- Extracts form fields
- Easy integration with Express.js

## Installation

Install the package using npm:

```bash
npm install upmulp
```

## Usage

### Basic Usage

Here's an example of how to use `upmulp` in an Express application:

```javascript
import express from "express";
import path from "path";
import fs from "fs";
import MultipartParser from "upmulp";

const app = express();

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.post("/upload", (req, res) => {
  const contentType = req.headers["content-type"];
  if (!contentType || !contentType.includes("multipart/form-data")) {
    return res.status(400).send("Invalid content type");
  }

  const boundary = contentType.split("boundary=")[1];
  const parser = new MultipartParser(boundary);

  parser.parse(req, (err, result) => {
    if (err) {
      return res.status(500).send("Error parsing form data");
    }

    console.log("Files:", result.files);
    console.log("Fields:", result.fields);
    res.status(200).send("Upload successful");
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### MultipartParser Class

The `MultipartParser` class is responsible for parsing multipart form data. Below are its main methods and properties.

#### Constructor

```javascript
const parser = new MultipartParser(boundary);
```

boundary: The boundary string used to separate parts in the multipart form data.

#### Methods

##### `parse(req, callback)`

Parses the incoming request stream.

- `req`: The HTTP request object.
- `callback`: A callback function that receives an error (if any) and the parsed result.

Example:

```javascript
parser.parse(req, (err, result) => {
  if (err) {
    console.error("Error parsing form data:", err);
  } else {
    console.log("Parsed fields:", result.fields);
    console.log("Parsed files:", result.files);
  }
});
```

### Result Object

The result object passed to the callback contains two properties:

- `fields`: An object containing form fields.
- `files`: An array of file objects, each with the following properties:
  - `name`: The name of the form field.
  - `path`: The path to the uploaded file on the server.

### Example

Below is a complete example showing how to use `upmulp` in an Express application:

```javascript
import express from "express";
import path from "path";
import fs from "fs";
import MultipartParser from "upmulp";

const app = express();

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.post("/upload", (req, res) => {
  const contentType = req.headers["content-type"];
  if (!contentType || !contentType.includes("multipart/form-data")) {
    return res.status(400).send("Invalid content type");
  }

  const boundary = contentType.split("boundary=")[1];
  const parser = new MultipartParser(boundary);

  parser.parse(req, (err, result) => {
    if (err) {
      return res.status(500).send("Error parsing form data");
    }

    console.log("Files:", result.files);
    console.log("Fields:", result.fields);
    res.status(200).send("Upload successful");
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## Development

### Running Tests

To run the tests, use the following command:

```bash
npm test
```

### Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Acknowledgements

- Inspired by the need to handle multipart form data in Node.js applications.
- Uses concepts from existing multipart parsers like `multer` and `busboy`.

---

Thank you for using `upmulp`! If you have any questions or need further assistance, feel free to open an issue or contact me.
