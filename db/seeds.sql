INSERT INTO departments (name)
VALUES  ('Sales'),
        ('Human Resources'),
        ('Finance'),
        ('Administration');

INSERT INTO roles (id, title, salary, department_id)
VALUES  (1, 'Portfolio Manager', 200000, 1),
        (2, 'Financial Advisor', 90000, 1),
        (3, 'HR Manager', 100000, 2),
        (4, 'Benefits Analyst', 75000, 2),
        (5, 'Payroll Analyst', 80000, 2),
        (6, 'Treasurer', 120000, 3),
        (7, 'FP&A', 140000, 3),
        (8, 'Complex Manager', 500000, 4),
        (9, 'Branch Administrator', 250000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ('Steve', 'Lee', 1, 8),
        ('Jonathan', 'Kim', 1, 8),
        ('Danny', 'Lee', 2, 1),
        ('Adam', 'Shayo', 2, 9),
        ('Lawrence', 'Frers', 3, null),
        ('Rachel', 'Blustein', 4, 3),
        ('Samantha', 'Maison', 5, 3),
        ('Jin', 'Park', 6, null),
        ('Cameron', 'Brusa', 7, 6),
        ('John', 'Palazetti', 8, null),
        ('Laura', 'Cooney', 8, null),
        ('Katie', 'Platt', 9, 8);