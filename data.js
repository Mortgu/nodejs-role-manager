const mysql = require('mysql');

const ROLE = {
    ADMIN: 'admin',
    MODERRATOR: 'mod',
    SUPPORTER: 'sup',
    BASIC: 'basic'
}

module.exports = {
    ROLE: ROLE,
    projects: []
}