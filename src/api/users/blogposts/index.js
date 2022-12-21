import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const blogsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogposts.json"
);

const blogsRouter = express.Router();

// get
blogsRouter.get("/", (request, response) => {
  const fileContent = fs.readFileSync(blogsJSONPath);
  console.log("FILE CONTENT: ", fileContent);

  const blogs = JSON.parse(fileContent);

  response.send(blogs);
});
blogsRouter.post("/", (request, response) => {
  console.log("REQUEST BODY: ", request.body);

  const newBlog = { ...request.body, createdAt: new Date(), _id: uniqid() };
  console.log("NEW Blog: ", newBlog);

  const blogsArray = JSON.parse(fs.readFileSync(blogsJSONPath));

  blogsArray.push(newBlog);

  fs.writeFileSync(blogsJSONPath, JSON.stringify(blogsArray));

  response.status(201).send({ id: newBlog.id });
});
// get by id
blogsRouter.get("/:blogsId", (request, response) => {
  const blogsID = request.params.blogsId;

  const blogsArray = JSON.parse(fs.readFileSync(blogsJSONPath));

  const foundBlog = blogsArray.find((blog) => blog.id === blogsID);

  response.send(foundBlog);
});
// put
blogsRouter.put("/:blogsId", (request, response) => {
  const blogsArray = JSON.parse(fs.readFileSync(blogsJSONPath));

  const index = blogsArray.findIndex(
    (blog) => blog.id === request.params.blogsId
  );
  const oldBlog = blogsArray[index];

  const updatedBlogs = { ...oldBlog, ...request.body, updatedAt: new Date() };

  blogsArray[index] = updatedBlogs;

  fs.writeFileSync(blogsJSONPath, JSON.stringify(blogsArray));

  response.send(updatedBlogs);
});
// del
blogsRouter.delete("/:blogsId", (request, response) => {
  const blogsArray = JSON.parse(fs.readFileSync(blogsJSONPath));

  const remainingBlogs = blogsArray.filter(
    (blog) => blog.id !== request.params.blogsId
  );

  fs.writeFileSync(blogsJSONPath, JSON.stringify(remainingBlogs));

  response.status(204).send();
});

export default blogsRouter;
