'use strict';

const os = require('os')
const cluster = require('cluster')

const cpuCount = os.cpus().length
const workers = []

const Util = require('../utils/util')

const workersCount = 8
const defaultElementsByTask = 10

const divide = array => {
  const tasks = Util.chunkArray(array, defaultElementsByTask, workersCount)
  for (let i = 0; i < cpuCount; i++) {
    const worker = cluster.fork()
    workers.push(worker)
  }

  const results = []
  for (const worker of workers) {
    const task = tasks.pop()
    if (!task) return
    worker.send({ task })

    worker.on('exit', code => {
      console.log('Worker exited:', worker.process.pid, code)
    })

    worker.on('message', message => {
      console.log('Message from worker', worker.process.pid);
      results.push(message.result)
      if (results.length === cpuCount) {
        process.exit(0)
      }
    })
  }
}

module.exports.divide = divide
