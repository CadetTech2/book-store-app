USE taskdb;

INSERT INTO tasks (title, description, status, priority, due_date) VALUES
('Deploy Task App to Cloud', 'Set up the web application on AWS/Azure, configure env variables, and connect to a cloud database.', 'pending', 'high', DATE_ADD(CURDATE(), INTERVAL 3 DAY)),
('Create Presentation Slides', 'Draft slides explaining the cloud architecture, database configurations, and Docker integration.', 'pending', 'medium', DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
('Refactor API Error Middleware', 'Standardize error response JSON payload on the Express backend for cleaner client integration.', 'completed', 'low', DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
('Setup Database Replication', 'Investigate multi-AZ RDS deployment models for high availability and load distribution.', 'pending', 'high', DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
('Optimize Front-End Assets', 'Configure production builds, cache policies, and optimize Tailwind utilities to reduce file sizes.', 'completed', 'medium', DATE_SUB(CURDATE(), INTERVAL 2 DAY));
