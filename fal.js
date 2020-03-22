'use strict'

const fs = require('fs')
const path = require('path')

const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')
const watermark = require('image-watermark')

//const Rebuild = require('./rebuild')
//const Util = require('./util')

const promisify = (func, args) => new Promise((resolve, reject) =>
  func.apply(null, [...args, (err, result) =>
    err ? reject(err) : resolve(result)
  ])
)

function getItems(folder = __dirname) {
  return promisify(fs.readdir, [folder])
}

const compress = (folder, avatar) => {
  console.log({ compare: `${__dirname}/images/${avatar}` })
    return imagemin([`${folder}/${avatar}`], {
      destination: 'images',
      plugins: [ imageminJpegtran(), imageminPngquant({ quality: [0.6, 0.8] }) ]
    })
    //const compare = `${__dirname}/images/${avatar}`
    //add(compare)
}


const add = async imagePath => {
  const options = {
    'text' : 'sample watermark',
    'color' : 'rgb(154, 50, 46)',
    'dstPath' : `${imagePath}`
  }
  fs.exists(imagePath, exists => {
  console.log({ imagePath })
  if (!exists) return console.log('DO NOT ENTER')
  watermark.embedWatermark(imagePath, options)
})
}






module.exports = { compress, add }
