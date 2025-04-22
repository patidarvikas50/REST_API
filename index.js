const express = require("express");
const app = express();
const PORT = 8000;
const users = require("./MOCK_DATA.json");
const fs = require("fs");


// Middleware Pluggins---
app.use(express.urlencoded({extended:false}))

// Routes
app.get("/users", (req, res) => {
  const html = `
        <ul>
        ${users
          .map((user, index) => `<li>${index + 1} ${user.first_name}</li>`)
          .join("")}
        </ul>
        `;
  res.send(html);
});

// REST API
app.get("/api/users", (req, res) => {
  return res.json(users);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    // Get user with id
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
  return  res.json(user);
  })
  .patch((req, res) => {
    // Edit user with id
    return res.json({ status: "pending" });
  })
  .delete((req, res) => {
    // Delete user with id
    return res.json({ status: "pending" });
  });



//    Create a new user using post method and postman 
app.post("/api/users", (req, res) => {
    const body = req.body;
    const newUser = {...body, id: users.length +1}
    users.push(newUser);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err,data)=>{
        if (err) {
            return res.status(500).json({ status: "Error", message: "Failed to save User" });
           }
           {
            return res.json({ status: "Success", user: newUser, id: users.length });
           }
    })
});

app.listen(PORT, () => console.log(`Server Strted at Port : ${PORT}`));
