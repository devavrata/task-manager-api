//CRUD create read update delete

const {MongoClient, ObjectID} = require('mongodb')

const id = new ObjectID()

const connectionURL = 'mongodb://127.0.0.1:27017'
//database name
const databaseName = 'task-manager'

console.log(id)
console.log(id.getTimestamp())

MongoClient.connect(connectionURL, { useNewUrlParser: true} , (error, client) => {

        if(error){
            return console.log('Unable to connect to database!')
        }

        // console.log('Connected Correctly!')
        const db = client.db(databaseName)
        // db.collection('users').insertOne({
        //     name:'Indrani',
        //     age: 30
        // }, (error, result) => {

        //         if(error){
        //             return console.log('Unable to insert the document!')
        //         }
        //         console.log(result.ops)
        // })

        //add many doucments in one go
        // db.collection('users').insertMany([
        //     {
        //         name: 'Dhirendra',
        //         age: 33
        //     },
        //     {
        //         name: 'Satyendra',
        //         age: 34
        //     }
        // ], (error, result)=> {
        //     if(error){
        //         return console.log('Unable to insert many resords in users collection!')
        //     }
        //     console.log(result.ops)
        // })

        //doing the challenge add 3 task to new task collection
        // db.collection('tasks').insertMany([
        //     {
        //         description: 'washing utensils',
        //         completed: false
        //     },
        //     {
        //         description: 'Workout',
        //         completed: true
        //     },
        //     {
        //         description: 'Create shopping list',
        //         completed: false
        //     }
        // ], (error, result) => {
        //     if(error){
        //         return console.log('Unable to add documents to collection tasks!')
        //     }
        //     console.log(result.ops)
        // })

        //fetching data from mongodb

        // db.collection('users').findOne({name: 'Indrani'},(error, user)=> {
        //     if(error){
        //         return console.log('Unable to find!')
        //     }
        //     console.log(user)
        // })

        //fetch with find it will find many========================================================
        // db.collection('users').find({age:27}).toArray((error, users) => {
        //     if(error){
        //         return console.log('Unable to find users')
        //     }
        //     console.log(users)
        // })

        // db.collection('users').find({age:27}).count((error, count)=>{
        //     if(error){
        //         return console.log('Unable to fetch')
        //     }
        //     console.log(count)
        // })

        //challenge solution
        // db.collection('tasks').findOne({_id: new ObjectID('5f0967d3039f2247c43c5f09')}, (error, task) => {
        //     if(error){
        //         return console.log('Unable to fetch!')
        //     }

        //     console.log(task)
        //     console.log('Printing second task output=======================================')
        // })

        

        // db.collection('tasks').find({completed: false}).toArray((error, tasks) => {
            
        //     if(error){
        //         return console.log('Unable to fetch tasks!')
        //     }
        //     console.log(tasks)
        // })


        //Updating data in mongodb=================

        // db.collection('users').updateOne({_id: new ObjectID("5f0960e42c8b474648d90328")}, {
        //     $inc: {age:2}}).then((resolve)=>{
        //     console.log(resolve)
        // }).catch((reject)=> {
        //     console.log(reject)
        // })

        //challenge resolving for updateMany
        // db.collection('tasks').updateMany({},{
        //     $set: {
        //         completed: true
        //     }
        // }).then((result)=> {
        //     console.log(result)
        // }).catch((error)=> {
        //     console.log(error)
        // })

        //Deleting data in mongodb=======================

        // db.collection('users').deleteOne({age:33}).then((result)=> {
        //     console.log(result.modifiedCount)
        // }).catch((error)=> {
        //     console.log(error)
        // })

        // db.collection('users').deleteMany({name: 'Devavrata'}).then((result)=> {
        //     console.log(result)
        // }).catch((error)=> {
        //     console.log(error)
        // })

        db.collection('tasks').deleteOne({description: 'Workout'}).then((result)=> {
            console.log(result)
        }).catch((error) => {
            console.log(error)
        })

})