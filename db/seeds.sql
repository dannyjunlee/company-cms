INSERT INTO departments (name)
VALUES  ('Sales'),
        ('Human Resources'),
        ('Finance'),
        ('Administration');

INSERT INTO roles (title, salary, department_id)
VALUES  ('Portfolio Manager', 200000, 1),
        ('Financial Advisor', 90000, 1),
        ('HR Manager', 100000, 2),
        ('Benefits Analyst', 75000, 2),
        ('Payroll Analyst', 80000, 2),
        ('Treasurer', 120000, 3),
        ('FP&A', 140000, 3),
        ('Complex Manager', 500000, 4),
        ('Branch Administrator', 250000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ('Steve', 'Lee', 1, 8),
        ('Jonathan', 'Kim', 1, 8),
        ('Chris', 'Chung', 2, null),
        ('Adam', 'Shayo', 2, 1),
        ('Tomas', 'DeRosa', 2, 8),
        ('Lawrence', 'Frers', 3, null),
        ('Rachel', 'Blustein', 4, 3),
        ('Samantha', 'Maison', 5, 3),
        ('Jin', 'Park', 6, null),
        ('Cameron', 'Brusa', 7, 6),
        ('John', 'Palazetti', 8, null),
        ('Laura', 'Cooney', 8, null),
        ('Katie', 'Platt', 9, 8);