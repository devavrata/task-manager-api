const express = require('express')
const User = require('../model/user')
const auth = require('../middleware/auth')
const Tasks = require('../model/task')
const multer = require('multer')
const sharp = require('sharp')
const account = require('../emails/account')

const router = new express.Router()

router.get('/test', (req, res)=>{
    res.send('Test router data')
})

//route for users to sign up
router.post('/users', async (req, res) => {
    
    const user = new User(req.body)
    try{
        const token = await user.generateAuthTokens()
        // await user.save()
        account.sendWelcomeEmail(user.email, user.name)
        res.status(201).send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
    
})

//add multer configuration
const uploadProfileAvatar = multer({
    limits: {
        fileSize: 3000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|JPG)$/)){
            return cb(new Error('Please upload image!'))
        }
        return cb(undefined, true)
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

router.delete('/users/me/avatar', auth,  async (req, res) => {
    try{
        req.user.avatar = undefined
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(404).send()
    }
    
})

router.post('/users/me/avatar', auth,  uploadProfileAvatar.single('avatar') , async (req, res)=> {

    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    //reduced size buffer of the image with png format
    req.user.avatar = buffer
    // req.user.avatar = req.file.buffer
    await req.user.save()

    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

//route for user to login
router.post('/users/login', async (req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthTokens()
        res.send({user, token})
    }catch(e){
        res.status(400).send()
    }
    
})

//route for logout user for specific device or token
router.post('/users/logout', auth, async (req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((tokenObject)=>{
            return tokenObject.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

//route for logout user from all over, logout all tokens
router.post('/users/logoutall', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

//without middleware : request --> route handler
//with middleware : request --> do something --> route handler

//route for getting all uesers
//In order to apply middle
router.get('/users/me', auth, async (req, res) => {

    try{
        // const users = await User.find({})
        const user = req.user
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
})

//route for updating the user
router.patch('/users/me', auth, async (req, res)=>{
    //handle custom errors
    const updates = Object.keys(req.body)
    const allowedParams = ['name', 'age', 'email', 'password']
    var isValidUpdate = updates.every((update)=>{
        return allowedParams.includes(update)
    })

    if(!isValidUpdate){
        return res.status(404).send({error:'Invalid update!'})
    }
    
    try{
        const user = req.user
        //update the values in user
        updates.forEach((update)=>{
            //use [] to show accessing direct properties
            user[update] = req.body[update]
        })
        await user.save()
        res.send(user)
    }catch(e){
        res.status(404).send(e)
    }
})

//delete route for user
router.delete('/users/me', auth, async (req, res)=>{
    try{
        //delete all the tasks created by this user!
        // const taskToDelete = await Tasks.deleteMany({owner: req.user._id})

        // if(!taskToDelete){
        //     throw new Error()
        // }

        await req.user.remove()
        account.sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router


