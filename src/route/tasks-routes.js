const express = require('express')
const Tasks = require('../model/task')
const auth = require('../middleware/auth')

const router = new express.Router()

//route to get all tasks
//GET /tasks
//GET /tasks?completed=true&limit=2&skip=1
//GET /tasks?sortBy=createdAt_desc
router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'desc'?-1:1
    }

    try{
        // const tasks = await Tasks.find({owner: req.user._id})
        await req.user.populate({
            path: 'taskList',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        //populate taskList based on condition like completed == true or false etc

        if(!req.user.taskList || req.user.taskList === 'null'){
            res.status(404).send()
        }
        res.send(req.user.taskList)
    }catch(e){
        res.status(500).send()
    }
})

//route to get individual task
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try{
        // const task = await Tasks.findById(_id)
        const task = await Tasks.findOne({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

//route for create task
router.post('/tasks', auth, async (req, res) => {

    //using owner id as ref of relating task with specific user
    const task = await new Tasks({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send()
    }

})

router.patch('/tasks/:id', auth, async (req, res)=>{

    //handle custom errors
    const updates = Object.keys(req.body)
    const allowedParams = ['description', 'completed']
    const isValidUpdate = updates.every((update)=>allowedParams.includes(update))

    if(!isValidUpdate){
        return res.status(400).send({error:'Invald task update!'})
    }
    
    try{
        // const task = await Tasks.findById(req.params.id)
        const task = await Tasks.findOne({_id: req.params.id, owner: req.user._id})

        if(!task){
            return res.status(404).send({error:'Task not found!'})
        }

        updates.forEach((update)=>{
            task[update] = req.body[update]
        })
        await task.save()
        
        res.send(task)
    }catch(e){
                
        res.status(400).send(e)
    }

})

router.delete('/tasks/:id', auth, async (req, res)=>{
    try{
        // const taskDeleted = await Tasks.findByIdAndDelete(id)
        const taskDeleted = await Tasks.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!taskDeleted){
            return res.status(404).send()        
        }
        res.send(taskDeleted)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router