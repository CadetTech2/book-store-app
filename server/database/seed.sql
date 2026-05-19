-- T-SQL Seed Data for Azure SQL Database / Microsoft SQL Server
-- Run this script inside your target database after running schema.sql.

INSERT INTO tasks (title, description, status, priority, due_date) VALUES
('Deploy Task App to Cloud', 'Set up the web application on AWS/Azure, configure env variables, and connect to a cloud database.', 'pending', 'high', DATEADD(day, 3, CAST(GETDATE() AS DATE))),
('Create Presentation Slides', 'Draft slides explaining the cloud architecture, database configurations, and Docker integration.', 'pending', 'medium', DATEADD(day, 5, CAST(GETDATE() AS DATE))),
('Refactor API Error Middleware', 'Standardize error response JSON payload on the Express backend for cleaner client integration.', 'completed', 'low', DATEADD(day, -1, CAST(GETDATE() AS DATE))),
('Setup Database Replication', 'Investigate multi-AZ RDS deployment models for high availability and load distribution.', 'pending', 'high', DATEADD(day, 7, CAST(GETDATE() AS DATE))),
('Optimize Front-End Assets', 'Configure production builds, cache policies, and optimize Tailwind utilities to reduce file sizes.', 'completed', 'medium', DATEADD(day, -2, CAST(GETDATE() AS DATE)));
