// Dependencies
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const utils = require('util');

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

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
            message: 'What would you like to do?',
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
            case 'Quit':
                db.end();
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
        console.table(res);
    });
};

// View all roles
const viewRoles = () => {
    console.log('View all roles');
    db.query('SELECT * FROM roles', function (err, res) {
        if (err) throw err;
        console.table(res);
    });
};

// View all employees
const viewEmployees = () => {
    console.log('View all employees');
    db.query('SELECT * FROM employees', function (err, res) {
        if (err) throw err;
        console.table(res);
    });
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
        console.table(res);
        console.log(`${response.newDept} has been added to departments.`);
    });
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
        console.table(res);
        console.log(`${response.newRole} has been added to roles.`);
    });
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
            message: 'What is the lsat name of the new employee?',
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

    // Solving for role_id
    var roles = [];
    db.query('SELECT * FROM roles', function (err, res) {
        res.forEach(role => roles.push(role));
    });

    let index;
    for (let i = 0; i < roles.length; i++) {
        if (response.role === roles[i]) index = i;
        else index = roles.length + 1;
    };

    // Solving for manager_id
    let mgrs = [];
    db.query('SELECT `first_name`, `last_name` FROM employees', function (err, res) {
        res.forEach(mgr => mgrs.push(mgr));
    });

    let index2;
    for (let i = 0; i < mgrs.length; i++) {
        if (response.manager.split(' ')[1] === mgrs[i][1]) index2 = i;
        else index2 = null;
    }

    // Add new employee
    await db.query('INSERT INTO employees (`first_name`, `last_name`, `role_id`, `manager_id`) VALUES (?, ?, ?, ?)', [response.firstName, response.lastName, response.role, response.manager], function (err, res) {
        console.table(res);
        console.log(`${response.firstName} ${response.lastName} has been added as a new employee`);
    });
};

// Update employee role

// End if 404
app.use((req, res) => {
    res.status(404).end();
});

// Listen
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});