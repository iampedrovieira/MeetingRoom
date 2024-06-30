const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const KEY = process.env.KEY;

module.exports = {
  async loginValidation(req, res) {
    try {
      const { user, password } = req.body;
      //find user with username and passwork equal to the data sent

      const userInfo = await Users.findAll({
        attributes: ["userid", "_name", "officeid", "_level","username"],
        where: {
          username: user,
          _password: password,
        },
      });

      //if login was successful
      if (userInfo.length != 0) {
        //Return json with jwt token
        return res.status(200).json({
          token: jwt.sign(
            {
              name: userInfo[0]._name,
              userid: userInfo[0].userid,
              defaultOffice: userInfo[0].officeid,
              level: userInfo[0]._level,
              username:userInfo[0].username
            },
            KEY,
            { expiresIn: "1h" }
          ),
        });
      } else {
        //return forbidden
        return res.status(403).json({ message: "error" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Something Wrong",
      });
    }
  },

  async sessionValidation(req, res) {
    try {
      const { token } = req.body;
      const decode = await jwt.verify(token, KEY);
      return res.status(200).json({
        message: "OK !",
      });
    } catch (error) {
      return res.status(500).json({
        message: "You are not authenticated",
      });
    }
  },

  async changeSessionOffice(req, res) {
    try {
      const { token, newOffice } = req.body;
      const decode = await jwt.verify(token, KEY);
      console.log(decode)
      return res.status(200).json({
        token: jwt.sign(
          {
            name: decode.name,
            userid: decode.userid,
            defaultOffice: newOffice,
            level: decode.level,
            username:decode.username
          },
          KEY,
          { expiresIn: "1h" }
        ),
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "You are not authenticated",
      });
    }
  },
};
