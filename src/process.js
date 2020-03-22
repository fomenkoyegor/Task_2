'use strict'

const Helpers = require('./helpers/helper')
const Master = require('./cluster/master')

const fs = require('fs')
const path = require('path')

async function checkStat(files) {
  Promise.all(files.forEach(async file => {
    try {
      const stat = await Helpers.promisify(fs.stat, [path.join(`${__dirname}`, file)])
      if (stat.isDirectory()) {
        const regExp = /uploads/
        const matched = regExp.test(file)
        if (matched) {
          const matchedFolder = file
          const avatars = await Helpers.getItems(`${__dirname}/${matchedFolder}`)
          const checkedItems = await Helpers.checkItems(matchedFolder, avatars)
          Master.divide(checkedItems)
        }
      }
    } catch(err) { console.log(err) }
  }))
}

async function start(folder) {
  try {
    const arrOfFiles = await Helpers.getItems(folder)
    checkStat(arrOfFiles)
  } catch(err) { console.log(err) }
}

module.exports = { start, checkStat }
