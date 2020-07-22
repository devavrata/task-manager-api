const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Tasks = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        validate(value){
            if(value===''){
                throw new Error('Name cannot be empty!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value === 'password' || value === 'Password'){
                throw new Error('Password is invalid!')
            }
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
    },
    age: {
        type: Number,
        required: true,
        validate(value){
            if(value < 18){
                throw new Error('Age is not eligible!');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('taskList', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthTokens = async function ()  {
    const user = this
    const authToken = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token: authToken})
    await user.save()
    return authToken
}

//use statics to define method on schema
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login')
    }
    //validate the password for the user logging in
    const isMatch = await bcryptjs.compare(password, user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user
}

//this is middleware method from mongoose which triggers this method before hitting Model.save method
//IMPORTANT to use function(){} and not arrow fundtion () => {} because function binds to this which is not the case in arrow function.
userSchema.pre('save', async function (next) {
    //here this returns the current user about to get save which means either triggered from create user or update user api
    const currentUser = this
    //add logic for hashing the password
    if(currentUser.isModified('password')){
        currentUser.password = await bcryptjs.hash(currentUser.password, 8)
    }
    next()
})

userSchema.pre('remove', async function(next){
    const user = this
    try{
        await Tasks.deleteMany({owner: user._id})
        next()
    }catch(e){
        throw new Error('Unable to Delete!')
    }
    
})

const User = mongoose.model('User', userSchema)

module.exports = User