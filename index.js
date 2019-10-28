const express = require("express");
const db = require("./data/db");

const server = express();
const port = 5000;

server.use(express.json());

// Get all users
server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(201).json(users);
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "The users information could not be retrieved."
      });
    });
});

//Get user by ID
server.get("/api/users/:id", (req, res) => {
  db.findById(req.params.id).then(user => {
    if (user) {
      res.status(201).json(user);
    } else {
      res.status(404).json({
        errorMessage: "The user with the specified ID does not exist."
      });
    }
  });
});

// Add user
server.post("/api/users", (req, res) => {
  const user = req.body;
  if (!user.name || !user.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.insert(user)
      .then(user => res.status(201).json(user))
      .catch(err =>
        res.status(500).json({
          error: "There was an error while saving the user to the database"
        })
      );
  }
});

// Update user by ID
server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const user = req.body;

  if (!id) {
    res
      .status(404)
      .json({ errorMessage: "The user with the specified ID does not exist." });
  } else if (!user.name || !user.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.update(id, user)
      .then(updateUser => {
        db.findById(id).then(updateUser => {
          res.json(updateUser);
        });
      })
      .catch(err => {
        res.status(500).json({
          errorMessage: "The user information could not be modified."
        });
      });
  }
});

// Delete user by ID
server.delete("/api/users/:id", (req, res) => {
  db.remove(req.params.id)
    .then(user => {
      if (user) {
        res.status(201).json({ message: `User was removed` });
      } else {
        res.status(404).json({
          errorMessage: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "The user could not be removed." });
    });
});

server.listen(port, () => {
  console.log(`\n Server listening on port ${port}\n`);
});
