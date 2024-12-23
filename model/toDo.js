const mongoose = require("mongoose")

const Schema = mongoose.Schema

const toDoModel = Schema({
    taskDescription : { 
        type: String,
        required: true 
        },
    status: {
        type: String, 
        enum: ['pending', 'completed', 'deleted'], 
        default: 'pending' 
        },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }
}
,{ timestamps: true })

const toDo = mongoose.model("todoList", toDoModel)

module.exports = toDo


