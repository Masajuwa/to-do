const express = require("express")
const taskController = require("../controller/todoController")
const authenticateJWT = require("../authenticate/auth")
const jwt = require("jsonwebtoken")

const todoRouter = express.Router()

todoRouter.get("/", authenticateJWT, taskController.getAllTasks)

todoRouter.post('/create', authenticateJWT, taskController.createTask)

todoRouter.put("/:id/status", authenticateJWT, taskController.updateTaskStatus)

todoRouter.put("/:id/description", authenticateJWT, taskController.updateTaskDescription)

todoRouter.delete("/:id", authenticateJWT, taskController.deleteTask)

module.exports = todoRouter

