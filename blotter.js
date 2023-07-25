const { con } = require("./connection")


const welcome = (req,res) => {
    res.status(200).send("Hello World! from home.js")
}

const getallblotter = (req,res) => {
    con.query("SELECT * FROM blotter", (err,result) => {
        if(err)res.status(400).json(err)
        res.status(200).json(result)
    })
}

const bcrypt = require('bcrypt');

const createblotter = (req, res) => {
  const { residentstatus, lastname, username, age, password } = req.body;
  
  if (residentstatus === "" || lastname === "" || username === "" || password === "") {
    return res.status(400).json("Please fill all fields");
  }
  
  con.query(
    'SELECT * FROM blotter WHERE username = ?',
    [username],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      
      if (result.length > 0) {
        return res.status(400).json("Username already in use");
      }
  
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json(err);
        }
  
        con.query(
          'INSERT INTO blotter (residentstatus, lastname, username, age, password) VALUES (?, ?, ?, ?, ?)',
          [residentstatus, lastname, username, age, hashedPassword],
          (err, result) => {
            if (err) {
              return res.status(400).json(err);
            }
            return res.status(200).json(result);
          }
        );
      });
    }
  );
};


const getblotter = (req, res) => {  
    const { id } = req.body;
    if (id === "") {
      res.status(400).json("Invalid ID");
    } else {
      con.query(`SELECT * FROM blotter WHERE id = "${id}"`, (err, result) => {
        if (err) {
          return res.status(400).json(err);
        } else {
          if (result.length === 0) {
            // Handle the case when no data is found for the given ID
            return res.status(404).json("No data found for the given ID");
          } else {
            // Return the data when successful
            return res.status(200).json(result);
          }
        }
      });
    }
  };


  const jwt = require('jsonwebtoken');
  // ... other import statements
  
  const loginblotter = (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json('Invalid username or password');
    }
  
    con.query(
      'SELECT * FROM blotter WHERE username = ?',
      [username],
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }
  
        if (result.length === 0) {
          return res.status(401).json('Invalid username or password');
        }
  
        const user = result[0];
        bcrypt.compare(password, user.password, (err, match) => {
          if (err) {
            return res.status(500).json(err);
          }
  
          if (!match) {
            return res.status(401).json('Invalid username or password');
          }
  
          // Successful login
          const token = jwt.sign({ username: user.username }, 'your_secret_key');
          const responseData = {
            token: token,
            user: {
              id: user.id,
              username: user.username,
              lastname: user.lastname,
              // Include any other user data you want to return
            }
          };
          return res.status(200).json(responseData);
        });
      }
    );
  };
  
  

module.exports = {
    welcome,
    getallblotter,
    createblotter,
    getblotter,
    loginblotter
}