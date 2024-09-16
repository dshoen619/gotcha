const express = require('express')
const router = express.Router()
const mysql = require('../mysql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

usersTable = process.env.USERS_TABLE
secretKey = process.env.SECRET_KEY
taskersTable = process.env.TASKERS_TABLE

const generateJwt = async (data) =>{
    return jwt.sign(data, secretKey);
}

const hashPassword = async (plainTextPassword) => {
    const saltRounds = 10;
  
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(plainTextPassword, salt);
      // Now you can store the hashed password in your database or return it
      return hash;
    } catch (err) {
      console.error('Error hashing password:', err);
      throw err; // Handle the error accordingly in your application
    }
  };

const comparePassword = async (plainTextPassword, hashedPassword) => {
    try {
      const match = await bcrypt.compare(plainTextPassword, hashedPassword);
      return match;
    } catch (err) {
      console.error('Error comparing passwords:', err);
      throw err; // Handle the error accordingly in your application
    }
  };

const getEmailByToken = async(token) => {
  selectQuery = `SELECT email FROM ${usersTable} where token = ?`
  const userData = await mysql.executeQuery(selectQuery, [token])
  return userData
}

const getuserDatabyToken = async(token) => {
  selectQuery = `SELECT id,email FROM ${usersTable} where token = ?`
  const userData = await mysql.executeQuery(selectQuery, [token])
  return userData[0]
}

const getTaskerIdbyEmail = async(email) => {
  selectQuery = `SELECT id FROM ${taskersTable} where email = ?`
  const taskerId = await mysql.executeQuery(selectQuery, [email])
  return taskerId
}

const isTokenValid= async(token)=> {
    try {
        // Decode the token (without verification)
        const decodedToken = jwt.decode(token);

        if (!decodedToken) {
            return false;
        }
        jwt.verify(token, secretKey); // Replace 'your_public_key' with the public key used on the server

        if (decodedToken.exp && decodedToken.exp < Math.floor(Date.now() / 1000)) {
          console.log('decoded token exp', decodedToken.exp)
            return {'status':false}; // Token is expired
        }

        const userData = await getuserDatabyToken(token)
        const returnData = {'status':true, 'userData': userData}
        return returnData;
    } catch (error) {
      console.log('error', error)
      return {'status':false};;
    }
} 
    
router.get('/isTokenValid', async(req,res)=>{
  const token = req.query.token
  console.log('token', token)
  const validToken = await isTokenValid(token)
  console.log(validToken)
  res.send(validToken)

})
 
router.get('/signIn', async (req, res) => {
    try {
      const email = req.query.email;
      const password = req.query.password;
      const hashedPassword = await hashPassword(password);
  
      const selectQuery = `SELECT * FROM ${usersTable} WHERE email=?`;
      const usersData = await mysql.executeQuery(selectQuery, [email]);
  
      if (usersData.length > 0) {
        const passwordInDb = usersData[0].password;
  
        const passwordsMatch = await comparePassword(password, passwordInDb);
  
        if (passwordsMatch) {
          const token = await generateJwt(email);
          const updateQuery = `UPDATE ${usersTable} SET token = ? WHERE email = ?`;
          const updateJWT = await mysql.executeQuery(updateQuery, [token, email]);          
          usersData.token = token; // Assign the new token to what is being sent to the frontend
          res.json(usersData);
          return;
        } else {
          res.send(false);
        }
      }
      res.send(false);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });


router.get('/signUp', async(req,res) =>{ 
   try{
    const email = req.query.email
    const password = req.query.password

    const selectQuery = `SELECT email from ${usersTable}`
    const existingEmails = await mysql.executeQuery(selectQuery)

    const emailAlreadyExists = existingEmails.some(existingEmail => existingEmail.email === email)

    if (emailAlreadyExists){
        res.send('email_exists')
        return
    }

    const hashedPassword = await hashPassword(password)
 
    const insertQuery = `INSERT INTO ${usersTable} (email, password) VALUES (?, ?)`;
    const insertNewUser = await mysql.executeQuery(insertQuery,[email,hashedPassword])
    
    res.send(true)
   }catch(err){
    console.log(err)
    res.send(err)
   }
   
})

router.get('/signUpWorker', async(req,res) =>{ 
  try{
   console.log('signupworker entered')
   const email = req.query.email
   const password = req.query.password

   const selectQuery = `SELECT email from ${usersTable}`
   const existingEmails = await mysql.executeQuery(selectQuery)

   const emailAlreadyExists = existingEmails.some(existingEmail => existingEmail.email === email)

   if (emailAlreadyExists){
       res.send('email_exists')
       return
   }

   const hashedPassword = await hashPassword(password)

   const insertQuery = `INSERT INTO ${usersTable} (email, password) VALUES (?, ?)`;
   const insertNewUser = await mysql.executeQuery(insertQuery,[email,hashedPassword])
   
   res.send(true)
  }catch(err){
   console.log(err)
   res.send(err)
  }
  
})

module.exports = {router:router, getEmailByToken, getuserDatabyToken, getTaskerIdbyEmail};