'use strict'

const fs = require('fs')
const cluster = require('cluster')
const Fal = require('../utils/fal')

process.on('message', message => {
  const { task } = message
  if (!task) return
  for (const file of task) {
    const str = file.split('/')
    const avatar = str[8]
    const folder = str[7]
    Fal.compress(folder, avatar).then(file => {
      const [ arr ] = file
      const { destinationPath } = arr
      Fal.add(destinationPath)
    })
  }
})
