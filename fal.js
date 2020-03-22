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

const compress = async (folder, avatar) => {
    console.log('COMPRIK')
    const files = imagemin([`${folder}/${avatar}`], {
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
  console.log({ path: imagePath })
    //for (let i = 0; i < 10; i++) fs.readdirSync(__dirname)
    const exists = fs.existsSync(imagePath)
    console.log({ exists }, 'EXISTS')
    console.log('WATERWARK BEFORE EXISTS')

    if (!exists) return console.log('DO NOT ENTER')
    console.log('WATERWARK AFTER EXISTS')
    watermark.embedWatermark(imagePath, options)
}






module.exports = { compress, add }
