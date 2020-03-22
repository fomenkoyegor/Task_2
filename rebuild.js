'use strict'

const fs = require('fs')
const path = require('path')

const os = require('os')
const cluster = require('cluster')

const Master = require('./master')
//console.log({ Master })

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
    const imagePath = path.resolve(__dirname, 'images', avatar)
    return imagePath
  }))
  return result
}


async function checkStat(files) {
  console.log({ files })
  await Promise.all(files.forEach(async file => {
    try {
      //console.log('entered checkStat')
      //console.log({ file })
      //const p = path.join(__dirname, file)
      //console.log({ p })
      const stat = await promisify(fs.stat, [path.join(__dirname, file)])
      if (stat.isDirectory()) {
        const regExp = /uploads/
        //console.log({ file })
        const matched = regExp.test(file)
        //console.log({ matched })
        if (matched) {
          const matchedFolder = file
          const avatars = await getItems(matchedFolder)
          const checkedItems = await checkItems(matchedFolder, avatars)
          //console.log({ checkedItems })

          Master.divide(checkedItems)

        }
      }
    } catch(err) { console.log(err) }
  }))
}

async function checkErrs(folder) {
  try {
    //console.log({ folder })
    //console.log('entered checkErrs')
    const arrOfFiles = await getItems(folder)
    await checkStat(arrOfFiles)
  } catch(err) { console.log(err) }
}

module.exports = { checkErrs /*checkItems*/ }
