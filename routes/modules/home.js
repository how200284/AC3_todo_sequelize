const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo
const User = db.User

router.get('/', async (req, res) => {
  try {
    const UserId = req.user.id
    const user = await User.findByPk(UserId)
    if (!user) throw new Error('user not found')  // throw new Error will terminate the execution and transfer the error object to catch.
    const todos = await Todo.findAll({
      raw: true,
      nest: true,
      where: { UserId }  // To make sure the home page shows todos which belong to this user only.
    })
    res.render('index', { todos })
  } catch(err) {
    res.status(402).json(error)
  }
})

module.exports = router