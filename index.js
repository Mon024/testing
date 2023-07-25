const express = require("express")
const blotter = require("./blotter")
const port = process.env.PORT || 3000;
const app = express()

app.use(express.json())

app.get("/", blotter.welcome)
app.get("/blotter", blotter.getallblotter)
app.post("/createblotter", blotter.createblotter)
app.get("/getblotter", blotter.getblotter)
app.post("/loginblotter", blotter.loginblotter)

app.listen(port, () => {
  console.log('Listening on Port ${port}');
})