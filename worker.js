'use strict'

const fs = require('fs')
const cluster = require('cluster')
const Fal = require('./fal')

process.on('message', message => {
  const { task } = message
  if (!task) return
  for (const file of task) {
    const folder = 'uploads'
    const avatar = file.split('/')[7]
    Fal.compress(folder, avatar).then(() => Fal.add(file))
  }
})
