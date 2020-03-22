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

//const dir = fs.readdirSync('uploads')
console.log({ diram: __dirname })

async function checkItems(folder, avatars) {
  const result = await Promise.all(avatars.map(async avatar => {
    const imagePath = path.resolve(__dirname, folder, avatar)
    console.log({ imagePath })
    return imagePath
  }))
  return result
}

async function checkStat(files) {
  Promise.all(files.forEach(async file => {
    try {
      const stat = await promisify(fs.stat, [path.join(__dirname, file)])
      const s = path.join(__dirname, file)
      console.log({ s })
      if (stat.isDirectory()) {
        const regExp = /uploads/
        const matched = regExp.test(file)
        console.log({ matched })
        if (matched) {
          console.log({ matched })
          const matchedFolder = file
          console.log({ matchedFolder }) // uploads
          const avatars = fs.readdirSync(`${__dirname}/${matchedFolder}`)//await getItems(file)
          console.log({ avatars })
          const checkedItems = await checkItems(matchedFolder, avatars)
          console.log({ checkedItems })
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
