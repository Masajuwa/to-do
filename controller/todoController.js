const mongoose = require("mongoose");
const toDoModel = require("../model/toDo")
const userModel = require("../model/user")

async function getAllTasks (req, res) {
    try {
        const filter = req.query.filter || 'all';
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 5; // Default to 5 tasks per page
        const userId = req.user.id; // Assuming `req.user` holds the logged-in user's data

        // Calculate skip and limit
        const skip = (page - 1) * limit;

        // Query tasks based on filter
        let tasks = [];
        if (filter === 'pending') {
            tasks = await toDoModel.find({ userId, status: 'pending' })
                .skip(skip)
                .limit(limit);
        } else if (filter === 'completed') {
            tasks = await toDoModel.find({ userId, status: 'completed' })
                .skip(skip)
                .limit(limit);
        } else {
            tasks = await toDoModel.find({ userId }) // Fetch all tasks
                .skip(skip)
                .limit(limit);
        }

        // Get total number of tasks to calculate pagination
        const totalTasks = await toDoModel.countDocuments({ userId });
        const totalPages = Math.ceil(totalTasks / limit);

        // Render the EJS template with tasks, filter, and pagination info
        res.render('todo', { tasks, filter, page, totalPages, totalTasks, limit });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send('Internal Server Error');
    }
};

async function createTask(req, res) {
    try {
        const { taskDescription } = req.body;

        // Create a new task
        const newTask = new toDoModel({
            taskDescription,
            userId: req.user.id,
        });


     // Save the new task to the database
     await newTask.save();

     // Redirect back to the to-do page
     res.redirect('/todo');
    } catch (error) {
     console.error('Error creating task:', error);
     res.status(500).send('Internal Server Error');
    }

};

async function updateTaskStatus (req, res) {
    try {
        const taskId = req.params.id;
        const { status } = req.body; 

        // Find and update the task
        const task = await toDoModel.findOneAndUpdate(
            { _id: taskId }, 
            { status },
            { new: true } // Return the updated task
        );

        if (!task) {
            return res.status(404).send('Task not found');
        }

        
        res.redirect('/todo');
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).send('Internal Server Error');
    }
};

async function updateTaskDescription (req, res) {
    try {
        const taskId = req.params.id;
        const { taskDescription } = req.body; 

        // Find and update the task description
        const task = await toDoModel.findOneAndUpdate(
            { _id: taskId },
            { taskDescription },
            { new: true } // Return the updated task
        );

        if (!task) {
            return res.status(404).send('Task not found');
        }

        res.redirect('/todo');

    } catch (error) {
        console.error('Error updating task description:', error);
        res.status(500).send('Internal Server Error');
    }
};

async function deleteTask (req, res) {
    try {
        const taskId = req.params.id;

        // Find and delete the task
        const task = await toDoModel.findOneAndDelete({ _id: taskId }); 

        if (!task) {
            return res.status(404).send('Task not found');
        }
        res.redirect('/todo');

    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    getAllTasks, 
    updateTaskStatus,
    updateTaskDescription,
    deleteTask,
    createTask
}