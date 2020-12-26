const express = require('express')
const router = express.Router()
const { projects } = require('../data')
const { authUser } = require('../basicAuth')
const { canViewProject, canDeleteProject, scopedProjects, canEditProject } = require('../permissions/project')
const session = require('express-session')

const { getProjects } = require('../index');

router.get('/', authUser, (req, res) => {
  res.json(scopedProjects(req.session, projects))
})

router.get('/:projectId', setProject, authUser, authGetProject, (req, res) => {
  console.log(req.project)
  res.json(req.project)
})

router.delete('/:projectId', setProject, authUser, authDeleteProject, (req, res) => {
  res.send('Deleted Project')
})

router.edit('/:projectId', setProject, authUser, authEditProject, (req, res) => {
    res.send('Edit Project')
})

function setProject(req, res, next) {
  const projectId = parseInt(req.params.projectId)
  req.project = projects.find(project => project.id === projectId)

  if (req.project === null) {
    res.status(404)
    return res.send('Project not found')
  }
  next()
}

function authGetProject(req, res, next) {
  if (!canViewProject(req.session, req.project)) {
    res.status(401)
    return res.send('Not Allowed !')
  }
  next()
}

function authDeleteProject(req, res, next) {
  if (!canDeleteProject(req.session, req.project)) {
    res.status(401)
    return res.send('Not Allowed')
  }
  next()
}

function authEditProject(req, res, next) {
    if(!canEditProject(req.session, req.project)) {
        res.status(401)
        return res.send('Not Allowed')
    }
    next()
}

module.exports = router
