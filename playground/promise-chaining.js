require('../src/db/mongoose')
const Task = require('../src/model/task')
const User = require('../src/model/user')

// Task.findByIdAndDelete('5f0b262469779f78449cf6d8').then((user)=>{
//     console.log(user)
//     return Task.countDocuments({completed: false})
// }).then((count)=>{
//     console.log('Incompleted task count: '+count)
// }).catch((e)=>{
//     console.log(e)
// })

// const promiseChaining = async () => {
//     const deletedUser = await Task.findByIdAndDelete('5f0a522f1669bf627561cccf')
//     const countOfDocument = await Task.countDocuments({completed: false})
//     return countOfDocument
// }

// promiseChaining().then((result)=> {
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

//5f0a6d3039c4f36876847dc9
const findUserAndUpdate = async (id, age)=> {
    const user = await User.findByIdAndUpdate(id, {age: age})
    const count = await User.countDocuments({age: age})
    return count
}

findUserAndUpdate('5f0a6d3039c4f36876847dc9', 24).then((result)=> {
    console.log('Count of user: '+ result)
}).catch((e)=> {
    console.log(e)
})