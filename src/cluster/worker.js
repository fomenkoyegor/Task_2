'use strict'

const fs = require('fs')
const cluster = require('cluster')
const Tool = require('../utils/fal')

process.on('message', message => {
  const { task } = message
  if (!task) return
  for (const file of task) {
    const str = file.split('/')
    const avatar = str[9]
    const folder = str[8]
    Tool.compress(folder, avatar).then(file => {
      const [ arr ] = file
      const { destinationPath } = arr
      Tool.add(destinationPath)
    })
  }
})
