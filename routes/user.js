const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");

router.post("/user/sign_up", async (req, res) => {
  try {
    const { firstName, lastName, email, psedo, password } = req.fields;
    const salt = uid2(16);
    const hash = SHA256(salt + password).toString(encBase64);
    const newUser = new User({
      account: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        psedo: psedo,
      },
      tasks: [],
      token: uid2(64),
      salt: salt,
      hash: hash,
    });
    await newUser.save();
    res.status(200).json(newUser.account);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
