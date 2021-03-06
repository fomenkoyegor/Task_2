'use strict'

const fs = require('fs')
const path = require('path')
const os = require('os')
const cluster = require('cluster')

const Master = require('./cluster/master')

const promisify = (func, args) => new Promise((resolve, reject) =>
  func.apply(null, [...args, (err, result) =>
    err ? reject(err) : resolve(result)
  ])
)

function getItems(folder = __dirname) {
  return promisify(fs.readdir, [folder])
}

async function checkItems(folder, avatars) {
  const result = await Promise.all(avatars.map(async avatar => {
    const imagePath = path.resolve(__dirname, folder, avatar)
    return imagePath
  }))
  return result
}

async function checkStat(files) {
  Promise.all(files.forEach(async file => {
    try {
      const stat = await promisify(fs.stat, [path.join(__dirname, file)])
      if (stat.isDirectory()) {
        const regExp = /uploads/
        const matched = regExp.test(file)
        if (matched) {
          const matchedFolder = file
          const avatars = await getItems(`${__dirname}/${matchedFolder}`)
          const checkedItems = await checkItems(matchedFolder, avatars)
          Master.divide(checkedItems)
        }
      }
    } catch(err) { console.log(err) }
  }))
}

async function checkErrs(folder) {
  try {
    const arrOfFiles = await getItems(folder)
    checkStat(arrOfFiles)
  } catch(err) { console.log(err) }
}

module.exports = { checkErrs }
