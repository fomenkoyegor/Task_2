'use strict';

const os = require('os')
const cluster = require('cluster')

const cpuCount = os.cpus().length
const workers = []

const Util = require('./util')

const workersCount = 8
const defaultElementsByTask = 10

const divide = array => {
  console.log({ array })
  const tasks = Util.chunkArray(array, defaultElementsByTask, workersCount)
  console.log({ tasks })

  for (let i = 0; i < cpuCount; i++) {
    const worker = cluster.fork()

    console.log('Started worker:', worker.process.pid)
    workers.push(worker)
  }

  const results = []

  workers.forEach(worker => {

    const task = tasks.pop()
    console.log('INSIDE WORKERSFOREACH - SENDING TASKS')
    if (!task) return
    console.log({ workertaskMaster: task })

    worker.send({ task })

    worker.on('exit', code => {
      //console.log('Worker exited:', worker.process.pid, code)
    })

    worker.on('message', message => {
      //console.log('END')
      //console.log('Message from worker', worker.process.pid);
      //console.log(message)
      results.push(message.result)
      if (results.length === cpuCount) {
        process.exit(0)
      }
    })

    setTimeout(() => process.exit(1), 5000)
  })
}


module.exports.divide = divide
