const express = require("express")
const blotter = require("./blotter")

const app = express()

app.use(express.json())

app.get("/", blotter.welcome)
app.get("/blotter", blotter.getallblotter)
app.post("/createblotter", blotter.createblotter)
app.get("/getblotter", blotter.getblotter)
app.post("/loginblotter", blotter.loginblotter)

app.listen(3000, () => {
  console.log("Listening on Port:3000")
})