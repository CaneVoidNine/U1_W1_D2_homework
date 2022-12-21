import express from "express";
import listEndpoints from "express-list-endpoints";
import usersRouter from "./api/users/index.js";
import cors from "cors";
import blogsRouter from "./api/users/blogposts/index.js";
const server = express();
const port = 3001;
server.use(cors());
server.use(express.json());

server.use("/authors", usersRouter);
server.use("/blogposts", blogsRouter);
server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
