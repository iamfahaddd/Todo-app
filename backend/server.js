const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const Todo = require("./Todo")

require("dotenv").config()

const dns = require("dns")
dns.setServers(["8.8.8.8", "8.8.4.4"])

const app = express()

app.use(cors())
app.use(express.json())


/* MongoDB Connection */

mongoose.connect(process.env.MONGO_URI)
  .then(function() {
    console.log("MongoDB connected")
  })
  .catch(function(error) {
    console.log("MongoDB connection error")
    console.log(error)
  })


/* Get All Todos */

app.get("/todos", function(req, res) {

  Todo.find()
    .then(function(todos) {
      res.json(todos)
    })
    .catch(function(error) {
      console.log(error)
      res.status(500).send("Error")
    })

})


/* Add Todo */

app.post("/todos", function(req, res) {

  const newTodo = new Todo({
    text: req.body.text,
    completed: false
  })

  newTodo.save()
    .then(function(todo) {
      res.json(todo)
    })
    .catch(function(error) {
      console.log(error)
      res.status(500).send("Error")
    })

})


/* Delete Todo */

app.delete("/todos/:id", function(req, res) {

  Todo.findByIdAndDelete(req.params.id)
    .then(function() {
      res.send("Todo deleted")
    })
    .catch(function(error) {
      console.log(error)
      res.status(500).send("Error")
    })

})


/* Complete Todo */

app.put("/todos/:id", function(req, res) {

  Todo.findByIdAndUpdate(
    req.params.id,
    {
      completed: req.body.completed
    }
  )
    .then(function() {
      res.send("Todo updated")
    })
    .catch(function(error) {
      console.log(error)
      res.status(500).send("Error")
    })

})


/* Start Server */

app.listen(5000, function() {
  console.log("Server is running on port 5000")
})