const express = require('express')
require('./db/mongoose')
const routeUser = require('./route/user-routes')
const routeTasks = require('./route/tasks-routes')

const app = express()
const port = process.env.PORT;

app.use(express.json())
app.use(routeUser)
app.use(routeTasks)

app.listen(port, () => {
    console.log('Server started on port: '+port)
})


