'use strict'

const cluster = require('cluster')

if (cluster.isMaster) require('../dub.js')
require('./worker.js')
