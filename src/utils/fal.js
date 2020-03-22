'use strict'

const fs = require('fs')
const path = require('path')

const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')
const watermark = require('image-watermark')

const promisify = (func, args) => new Promise((resolve, reject) =>
  func.apply(null, [...args, (err, result) =>
    err ? reject(err) : resolve(result)
  ])
)

function getItems(folder = __dirname) {
  return promisify(fs.readdir, [folder])
}

const compress = async (folder, avatar) => {
  return imagemin([`${folder}/${avatar}`], {
    destination: 'images',
    plugins: [ imageminJpegtran(), imageminPngquant({ quality: [0.6, 0.8] }) ]
  })
}

const add = imagePath => {
  const options = {
    'text' : 'sample watermark',
    'color' : 'rgb(154, 50, 46)',
    'dstPath' : `${imagePath}`
  }
  fs.exists(imagePath, exists => {
  if (!exists) return console.log(`No such path of file: ${imagePath}`)
  watermark.embedWatermark(imagePath, options)
  return 'end'
 })
}

module.exports = { compress, add }
