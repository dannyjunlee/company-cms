// Dependencies
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const utils = require('util');

// Establish MySQL connection
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '1!Tjalswjd132',
        database: 'mswm_db'
    },
    console.log('Connected to company_db database')
);

db.query = utils.promisify(db.query);

db.connect(function (err) {
    if (err) throw err;
    initialPrompt();
});

// Welcome Message
console.table(
    "\n------------ Morgan Stanley Smith Barney Employee Tracker ------------\n"
);

const initialPrompt = async () => {
    try {
        let action = await inquirer.prompt({
            type: 'list',
            message: 'What would you like to do? Press ctrl/cmd + C at any point to quit.',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role', 'Quit'],
            name: 'initPrompt'
        });
        switch (action.initPrompt) {
            case 'View all departments':
                viewDept();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDept();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update employee role':
                updateEmployee();
                break;
        };
    } catch (err) {
        console.log(err);
        initialPrompt();
    };
};

// Functions for the different prompt choices

// View all departments
const viewDept = () => {
    console.log('View all departments');
    db.query('SELECT * FROM departments', function (err, res) {
        if (err) throw err;
        console.log('\n');
        console.table(res);
    });
    initialPrompt();
};

// View all roles
const viewRoles = () => {
    console.log('View all roles');
    db.query('SELECT * FROM roles', function (err, res) {
        if (err) throw err;
        console.log('\n');
        console.table(res);
    });
    initialPrompt();
};

// View all employees
const viewEmployees = () => {
    console.log('View all employees');
    db.query('SELECT * FROM employees', function (err, res) {
        if (err) throw err;
        console.log('\n');
        console.table(res);
    });
    initialPrompt();
};

// Add a department
const addDept = async () => {
    console.log('Add a department');

    let response = await inquirer.prompt([
        {
            type: 'input',
            message: 'What is the new department?',
            name: 'newDept'
        }
    ])

    await db.query('INSERT INTO departments (`name`) VALUES (?)', [response.newDept], function (err, res) {
        console.log('\n');
        console.table(res);
        console.log(`${response.newDept} has been added to departments.`);
    });
    initialPrompt();
};

// Add a role
const addRole = async () => {
    console.log('Add a role');

    let response = await inquirer.prompt([
        {
            type: 'input',
            message: 'What is the new role?',
            name: 'newRole'
        },
        {
            type: 'number',
            message: 'What is the average salary for this role?',
            name: 'salary'
        },
        {
            type: 'input',
            message: 'What is the department ID for this role?',
            name: 'department'
        }
    ]);

    // Add new role
    await db.query('INSERT INTO roles (`title`, `salary`, `department_id`) VALUES (?, ?, ?)', [response.newRole, response.salary, response.department], function (err, res) {
        console.log('\n');
        console.table(res);
        console.log(`${response.newRole} has been added to roles.`);
    });
    initialPrompt();
};

// Add an employee
const addEmployee = async () => {
    console.log('Add an employee');

    let response = await inquirer.prompt([
        {
            type: 'input',
            message: 'What is the first name of the new employee?',
            name: 'firstName'
        },
        {
            type: 'input',
            message: 'What is the last name of the new employee?',
            name: 'lastName'
        },
        {
            type: 'input',
            message: 'What is the role ID of the new employee?',
            name: 'role'
        },
        {
            type: 'input',
            message: "Whos is the new employee's manager ID?",
            name: 'manager'
        }
    ]);

    // Add new employee
    await db.query('INSERT INTO employees (`first_name`, `last_name`, `role_id`, `manager_id`) VALUES (?, ?, ?, ?)', [response.firstName, response.lastName, response.role, response.manager], function (err, res) {
        console.log('\n');
        console.table(res);
        console.log(`${response.firstName} ${response.lastName} has been added as a new employee`);
    });
    initialPrompt();
};

// Update employee role
const updateEmployee = async () => {
    console.log('Update employee role');

    let response = await inquirer.prompt([
        {
            type: 'input',
            message: 'What is the ID of the employee you would like to update?',
            name: 'employeeID'
        },
        {
            type: 'input',
            message: 'What is the new role you would like to assign to this employee?',
            name: 'newRole'
        }
    ]);

    await db.query('UPDATE employees SET name = ? WHERE id = ?', [response.newRole, response.employeeID], function (err, res) {
        console.log('\n');
        console.table(res);
        console.log(`${response.newRole} has been assigned to employee ID ${response.employeeID}.`);
    });
    initialPrompt();
};