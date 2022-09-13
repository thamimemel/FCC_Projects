require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const autoIncrement = require('mongoose-auto-increment');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}))


// Basic Configuration
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI

// Connect Database
mongoose.connect(MONGO_URI, {}, () => {
  console.log("Database connected")
})

// Initialize auto increment plugin
autoIncrement.initialize(mongoose.connection)

// URL Schema & Model
const urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true,
    unique: true
  }
})

urlSchema.plugin(autoIncrement.plugin, {model: "URL", field: "short_url", startAt: 1})
const Url = mongoose.model('Url', urlSchema)

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Endpoint
app.post('/api/shorturl', async function(req, res) {
  const  regex = new RegExp (/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/)
  const {url} = req.body
  
  // Verify URL Format
  if (!url.match(regex)) {
    return res.json({ error: 'invalid url' })

  }
  // try {
  //   new URL(url)
  // } catch {
  // }


  // Init Url
  const createdUrl = new Url({
    original_url: url
  })

  // Save to DB
  try {
    const {original_url, short_url } = (await createdUrl.save()).toJSON();
    return res.json({original_url, short_url})

  } catch(e) {
    switch (e.code) {
      case 11000:
          return res.status(400).json({ error: 'URL already submitted' })
      default:
          return res.status(500).json({ error: 'Unexpected error while saving the url' })

    }
  }

});

app.get("/api/shorturl/:shorturl", async (req, res) => {
  const short_url = parseInt(req.params.shorturl)
  // Verify short url is number
  if (isNaN(short_url)) return res.status(400).json({ error: 'Bad format' })

  const url = await Url.findOne({short_url})
  // check url exists
  if (!url) return res.status(404).json({error: "Url not found"})
  // redirect to url
  return res.redirect(url.original_url)
  
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
