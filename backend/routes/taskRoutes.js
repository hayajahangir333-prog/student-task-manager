
const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/TaskModel");

const router = express.Router();

// GET: Get all tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
});

// POST: Add a task
router.post("/", async (req, res) => {
    try {
        const title = req.body.title;

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        const task = await Task.create({
            title: title.trim()
        });

        res.status(201).json({
            message: "Task added successfully",
            task
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to add task" });
    }
});

 // PUT: Update task completion status
router.put("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        if (typeof req.body.completed !== "boolean") {
            return res.status(400).json({
                message: "Completed must be true or false"
            });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { completed: req.body.completed },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully",
            task
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update task"
        });
    }
});


// DELETE: Delete a task
router.delete("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete task" });
    }
});

module.exports = router;
