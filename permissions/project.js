const { ROLE } = require('../data')

function canViewProject(user, project) {
  return (
    user.role === ROLE.ADMIN ||
    project.userId === user.userId
  )
}

function scopedProjects(user, projects) {
  if (user.role === ROLE.ADMIN) return projects
  return projects.filter(project => project.userId === user.userId)
}

function canDeleteProject(user, project) {
  return project.userId === user.userId
}

function canEditProject(user, project) {
    return project.userId === user.userId
}

module.exports = { canViewProject, scopedProjects, canDeleteProject }
