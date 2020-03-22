'use strict'

const fs = require('fs')
const cluster = require('cluster')
const Fal = require('../utils/fal')

process.on('message', message => {
  const { task } = message
  if (!task) return
  for (const file of task) {
    const folder = 'uploads'
    console.log({ file })
    const avatar = file.split('/')[8]//8
    console.log({ avatar })
    Fal.compress(folder, avatar).then((file) => {
      console.log({ filename: file })
      Fal.add(file)
    })
  }
})
