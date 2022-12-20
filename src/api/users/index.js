import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const usersJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "users.json"
);

console.log("TARGET --> ", usersJSONPath);

const usersRouter = express.Router();

usersRouter.post("/", (request, response) => {
  console.log("REQUEST BODY: ", request.body);

  const newUser = { ...request.body, createdAt: new Date(), id: uniqid() };
  console.log("NEW USER: ", newUser);

  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath));

  usersArray.push(newUser);

  fs.writeFileSync(usersJSONPath, JSON.stringify(usersArray));

  response.status(201).send({ id: newUser.id });
});

usersRouter.get("/", (request, response) => {
  const fileContent = fs.readFileSync(usersJSONPath);
  console.log("FILE CONTENT: ", fileContent);

  const users = JSON.parse(fileContent);

  response.send(users);
});

usersRouter.get("/:userId", (request, response) => {
  const userID = request.params.userId;

  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath));

  const foundUser = usersArray.find((user) => user.id === userID);

  response.send(foundUser);
});

usersRouter.put("/:userId", (request, response) => {
  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath));

  const index = usersArray.findIndex(
    (user) => user.id === request.params.userId
  );
  const oldUser = usersArray[index];

  const updatedUser = { ...oldUser, ...request.body, updatedAt: new Date() };

  usersArray[index] = updatedUser;

  fs.writeFileSync(usersJSONPath, JSON.stringify(usersArray));

  response.send(updatedUser);
});

usersRouter.delete("/:userId", (request, response) => {
  const usersArray = JSON.parse(fs.readFileSync(usersJSONPath));

  const remainingUsers = usersArray.filter(
    (user) => user.id !== request.params.userId
  );

  fs.writeFileSync(usersJSONPath, JSON.stringify(remainingUsers));

  response.status(204).send();
});

export default usersRouter;
