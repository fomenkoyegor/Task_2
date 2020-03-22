'use strict'

const fs = require('fs')
const cluster = require('cluster')
const Fal = require('./fal')

const folder = 'uploads'
process.on('message', message => {
  //for (let i = 0; i < 10; i++) fs.readdirSync(__dirname)
  //process.on('start', Tool.add)

  console.log({ workertasReceived: message })

  if (!message.task) return

  message.task.forEach(file => {
    console.log({ file })

    console.log('INSIDE WORKER - START')
    const avatar = file.split('/')[7]

    console.log('COMPRESS GO')
    Fal.compress('uploads', avatar)
    setTimeout(() => Fal.add(file) ,1000)
    //for (let i = 0; i < 1000; i++) fs.readdirSync(__dirname)
    console.log({ file, avatar })
    console.log({ ava: avatar })

    //setTimeout(() => process.emit('start', file), 100)
    //ee.on('start', Tool.add)

  //  let j = 0
  //  for (let i = 0; i < 2000; i++) j += 6

    //Tool.compress('uploads', avatar)
    //Tool.add(file)


    //return 'hello'
    //try {
    //  Image.open(file).tobytes()
    //} catch(err) { console.log('detected error image %s' % file) }

  })

  //process.send({ result })
})
