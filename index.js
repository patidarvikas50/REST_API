const express = require("express");
const app = express();
const users = require("./MOCK_DATA.json");
const PORT = 8000;
const fs = require("fs");

// Middleware Pluggins---
app.use(express.urlencoded({ extended: false }));

app.get("/users", (req, res) => {
  const html = `
  <ul>${users.map((user) => `<li>${user.first_name}</li>`).join("")}</ul>
  `;
  return res.send(html);
});

app.post("/api/users", (req, res) => {
  const body = req.body;
  const newUser = users.push({ ...body, id: users.length + 1 });

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "Error", message: "Failed to save data" });
    }
    return res.json({ status: "Success", user: newUser, id: users.length });
  });
});

// Routes
app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    const userIndex = users.findIndex((user)=> user.id === id) 

    if(userIndex === -1){
      return res.status(404)
      .json({status: "Error", message: "user not found"})
    }
    users[userIndex] = {...users[userIndex], ...body}

    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
      if(err){
        return res.status(505)
        .json({status: "Error", message: "failed to update user"})
      }{
        return res.json({status: "success", user:users[userIndex]})
      }
    })
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    const userIndex = users.findIndex((user)=> user.id === id) 

    if(userIndex === -1){
      return res.status(404)
      .json({status: "Error", message: "user not found"})
    }
    users.splice(userIndex, 1)

    users.forEach((user,index)=>{
      user.id = index+1;
    })

    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
      if(err){
        return res.status(505)
        .json({status: "Error", message: "failed to Delete user"})
      }{
        return res.json({status: "success", user:users[userIndex]})
      }
    })
  })

app.listen(PORT, console.log("Server started port:", PORT));
