const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/userRouter');
const taskRouter = require('./routers/taskRouter');

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.listen(port,()=>{
    console.log('Server is up and running in port',port)
})

// const Task = require('./models/task');
// const User = require('./models/user');

// const myFunction = async () => {
//     // const task = await Task.findById('5efa07d1d1f66191d842c05f');
//     // await task.populate('owner').execPopulate();
//     // console.log(task.owner);
//     const user = await User.findById('5efa0783d1f66191d842c05c');
//     await user.populate('tasks').execPopulate();
//     console.log(user.tasks);
// }

// myFunction();