// Dependencies
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

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
    const mysqlPrms = require('mysql2/promise');
    console.log('Add a department');

    let response = await inquirer.prompt([
        {
            type: 'input',
            message: 'What is the new department?',
            name: 'newDept'
        }
    ])

    db.query('INSERT INTO department (`name`) VALUES (?)', [response.newDept], function (err, res) {
        console.table(res);
    });

    console.log(`${response.newDept} has been added to departments.`);
    initialPrompt();
};

// Add a role
const addRole = () => {
    console.log('Add a role');

    let response = inquirer.prompt([
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
            message: 'What department is this role a part of?',
            name: 'department'
        }
    ]);

    // Solving for department_id
    var depts = [];
    db.query('SELECT * FROM departments', function (err, res) {
        res.forEach(dept => depts.push(dept));
    });

    let index;
    for (let i = 0; i < depts.length; i++) {
        if (response.department === depts[i]) index = i;
        else index = depts.length + 1;
    };

    // Add new role
    db.query('INSERT INTO roles VALUES ?', {title: response.newRole, salary: response.salary, department_id: index});

    console.log(`${response.newRole} has been added to roles.`)
}

// Add an employee
const addEmployee = async () => {
    console.log('Add an employee');

    let response = inquirer.prompt([
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
            message: 'What is the role of the new employee?',
            name: 'role'
        },
        {
            type: 'input',
            message: "Whos is the new employee's manager?",
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
    db.query('INSERT INTO employees VALUES ?', {first_name: response.firstName, last_name: response.lastName, role_id: index, manager_id: index2});

    console.log(`${response.first_name} ${response.last_name} has been added as a new employee`);
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