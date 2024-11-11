const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 8000;

const postsRouter = require("./router/posts");

app.use(cors());
app.use(express.json());

app.use("/api/posts", postsRouter);

app.listen(PORT, () =>
	console.log(`サーバー起動しました http://localhost:${PORT}`)
);
