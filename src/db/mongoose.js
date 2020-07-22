const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
})



// const me = new User({
//     name: 'Luther',
//     password: 'password',
//     email: 'LUTHAR@FIX.COM',
//     age: 21
// })

// me.save().then((me)=> {
//     console.log('Success:', me)
// }).catch((error) => {
//     console.log('Error:', error)
// })

//define mongoose model for tasks

// const Tasks = mongoose.model('Tasks', {
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//   }
// })

// const task1 = new Tasks({
//     completed: true
// })

// task1.save().then(() => {
//     console.log(task1)
// }).catch((error) => {
//     console.log('Error', error)
// })