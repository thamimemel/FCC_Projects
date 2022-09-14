const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

require('dotenv').config()

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))

// Basic Configuration
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI

// Connect Database
mongoose.connect(MONGO_URI, {}, () => {
  console.log("Database connected")
})

// User Schema and Model
const ExerciceUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  }
}, {versionKey: false})

const ExerciceUser = mongoose.model("ExerciceUser", ExerciceUserSchema)

// Exercice Schema & model
const ExerciceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExerciceUser",
    required: true
  },
  description: {
    type: String,
    required: true
  }, 
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {versionKey: false})

const Exercice = mongoose.model("Exercice", ExerciceSchema)
// API
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await ExerciceUser.find({})
    return res.json(users)

  } catch(e) {
    console.error(e)
    return res.status(500).json({error: "Internal server error"})
  }
})
// Create user
app.post("/api/users", async (req, res) => {
  try {
    const {username} = req.body
    if (!username) {
      return res.status(400).json({error: "Bad request"})
    }

    const user = new ExerciceUser({
      username
    })

    const savedUser = (await user.save()).toJSON()
    return res.json(savedUser)
  } catch(e) {
    console.error(e)
    return res.status(500).json({error: "Internal server error"})
  }
})

// Create exercice
app.post("/api/users/:_id/exercises", async (req, res) => {
  try {    
    // Verify user exists
    const user = await ExerciceUser.findById(req.params._id)
    if (!user) return res.status(404).json({error: "No such user"})
    // Payload
    const payload = req.body
    payload.user = req.params._id
    if (!payload.date) delete payload.date // Remove null dates

    try {
      const exercice = new Exercice(payload)
      const savedExercice = (await exercice.save()).toJSON()

      const response = {
        _id: user._id,
        username: user.username,
        date: savedExercice.date.toDateString(),
        duration: savedExercice.duration,
        description: savedExercice.description
      }
      return res.json(response)
    } catch(e) {
      if (e instanceof mongoose.Error.ValidationError) return res.status(400).json({error: e.message})
      return res.status(400).json({error: "Unhandled error saving exercice"})
    }
  } catch(e) {
    console.error(e)
    return res.status(500).json({error: "Internal server error"})
  }
})

// Get logs
app.get("/api/users/:_id/logs", async (req, res) => {
  try {    
    // Verify user exists
    const user = await ExerciceUser.findById(req.params._id)
    if (!user) return res.status(404).json({error: "No such user"})

    // Build search options
    const searchOptions = {}
    if (req.query.limit) searchOptions.limit = req.query.limit; 
    // Build search
    const search = {user: req.params._id}
    if (req.query.from || req.query.to) {
      search.date = {}
      if (req.query.from) search.date.$gt = new Date(req.query.from)
      if (req.query.to) search.date.$lt = new Date(req.query.to)
    }
    // Find exercices
    const userExercices = await Exercice.find(search, null, searchOptions).select(["-_id", "-user"])
    
    /// Build and send reponse
    const response = user.toJSON()
    response.count = userExercices.length
    response.log = userExercices.map(exercice => {
      exo = exercice.toJSON()
      exo.date = new Date(exo.date).toDateString()
      return exo
    })
    return res.json(response)

  } catch(e) {
    console.error(e)
    return res.status(500).json({error: "Internal server error"})
  }
})
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
