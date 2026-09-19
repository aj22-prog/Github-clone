const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createIssue(req, res) {
  const { title, description } = req.body;
  const repoId = req.body.repository || req.body.repoId || req.params.id;

  try {
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required!" });
    }

    if (!repoId || !mongoose.Types.ObjectId.isValid(repoId)) {
      return res.status(400).json({ error: "Valid Repository ID is required!" });
    }

    const issue = new Issue({
      title,
      description,
      repository: repoId,
    });

    await issue.save();

    res.status(201).json({ message: "Issue created successfully!", issue });
  } catch (err) {
    console.error("Error during issue creation : ", err.message);
    res.status(500).send("Server error");
  }
}

async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid issue ID format!" });
    }

    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    if (title !== undefined) issue.title = title;
    if (description !== undefined) issue.description = description;
    if (status !== undefined) issue.status = status;

    await issue.save();

    res.json({ message: "Issue updated successfully!", issue });
  } catch (err) {
    console.error("Error during issue updation : ", err.message);
    res.status(500).send("Server error");
  }
}

async function deleteIssueById(req, res) {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid issue ID format!" });
    }

    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }
    res.json({ message: "Issue deleted successfully!" });
  } catch (err) {
    console.error("Error during issue deletion : ", err.message);
    res.status(500).send("Server error");
  }
}

async function getAllIssues(req, res) {
  const repoId = req.params.id || req.query.repository || req.query.repoId;

  try {
    const filter = repoId ? { repository: repoId } : {};
    const issues = await Issue.find(filter).populate("repository");

    res.status(200).json(issues);
  } catch (err) {
    console.error("Error during issue fetching : ", err.message);
    res.status(500).send("Server error");
  }
}

async function getIssueById(req, res) {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid issue ID format!" });
    }

    const issue = await Issue.findById(id).populate("repository");

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    res.json(issue);
  } catch (err) {
    console.error("Error during issue fetching : ", err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};