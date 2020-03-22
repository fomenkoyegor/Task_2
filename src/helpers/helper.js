'use strict'

const fs = require('fs')
const path = require('path')

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

module.exports = { getItems, checkItems, promisify }
