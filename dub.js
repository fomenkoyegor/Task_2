'use strict'

const express = require('express')
const multer = require('multer')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')

const app = express()

const Rebuild = require('./rebuild')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    const { fieldname, originalname } = file
    const ext = path.extname(originalname)
    cb(null, `${fieldname}-${Date.now()}${ext}`)
  }
})

const checkFileType = (file, cb) => {
  let { originalname, mimetype } = file
  const filetypes = /png|jpeg/ // Allowed extensions
  //console.log({ filetypes, mimetype })
  const ext = path.extname(originalname)   // Check ext
  const extname = filetypes.test(ext)// Check mimetype

  const mimetypeChecked = filetypes.test(mimetype)
  console.log({ extname, ext, mimetypeChecked })
  if (mimetypeChecked && extname) return cb(null, true)
  return cb(new Error('Images Only!'))
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  }
})

app.post('/upload', upload.any(), async (req, res, next) => {
  const files = req.files
  //console.log({ files })
  if (files) return res.send('Files uploaded')
  const error = new Error('Please upload a file')
  //console.log({ status: error.httpStatusCode })
  error.httpStatusCode = 404
  return next(error)
})


async function main() {
  await Rebuild.checkErrs(__dirname)
}
main()

//ee.on('start', __dirname)
//ee.emit('start', main(folder))

//app.listen(3000)
