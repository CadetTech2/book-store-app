USE bookvault;

-- Admin user (password: Admin123!)
-- bcrypt hash for 'Admin123!' with 12 rounds
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@bookvault.com', '$2b$12$LJ3m4ys3GZfnMRqYL0YX4OU0jYv0JGkPVXHqGnWF.FUbVJ3cO2kGe', 'admin');

INSERT INTO categories (name, slug) VALUES
('Fiction', 'fiction'),
('Non-Fiction', 'non-fiction'),
('Science & Technology', 'science-technology'),
('Business & Economics', 'business-economics'),
('Self-Help', 'self-help'),
('Biography', 'biography'),
('History', 'history'),
('Philosophy', 'philosophy'),
('Programming', 'programming'),
('Design & Art', 'design-art');

INSERT INTO books (title, author, isbn, description, price, stock, category_id, pages, publisher, published_year, is_featured) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 'A story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan, set against the backdrop of the Roaring Twenties.', 12.99, 50, 1, 180, 'Scribner', 2004, TRUE),

('Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', '9780062316097', 'An exploration of the history of the human species from the evolution of archaic human species in the Stone Age up to the present day.', 18.99, 35, 2, 464, 'Harper', 2015, TRUE),

('Clean Code', 'Robert C. Martin', '9780132350884', 'A handbook of agile software craftsmanship that teaches principles, patterns, and practices of writing clean code.', 39.99, 25, 9, 431, 'Prentice Hall', 2008, TRUE),

('Atomic Habits', 'James Clear', '9780735211292', 'An easy and proven way to build good habits and break bad ones with practical strategies.', 16.99, 60, 5, 320, 'Avery', 2018, TRUE),

('Thinking, Fast and Slow', 'Daniel Kahneman', '9780374533557', 'A groundbreaking tour of the mind that explains the two systems that drive the way we think.', 15.99, 40, 8, 499, 'Farrar, Straus and Giroux', 2011, FALSE),

('The Lean Startup', 'Eric Ries', '9780307887894', 'How today is entrepreneurs use continuous innovation to create radically successful businesses.', 24.99, 30, 4, 336, 'Currency', 2011, TRUE),

('1984', 'George Orwell', '9780451524935', 'A dystopian novel set in a totalitarian society ruled by Big Brother that has become a universal symbol of oppressive government.', 11.99, 45, 1, 328, 'Signet Classic', 1961, FALSE),

('Steve Jobs', 'Walter Isaacson', '9781451648539', 'The exclusive biography of Steve Jobs, based on more than forty interviews with the Apple co-founder.', 19.99, 20, 6, 656, 'Simon & Schuster', 2011, FALSE),

('Design Patterns', 'Erich Gamma', '9780201633610', 'Elements of reusable object-oriented software that captures best practices in software design.', 49.99, 15, 9, 395, 'Addison-Wesley', 1994, FALSE),

('A Brief History of Time', 'Stephen Hawking', '9780553380163', 'A landmark volume in science writing by one of the great minds of our time exploring the nature of the universe.', 14.99, 30, 3, 212, 'Bantam', 1998, TRUE),

('The Psychology of Money', 'Morgan Housel', '9780857197689', 'Timeless lessons on wealth, greed, and happiness from award-winning author Morgan Housel.', 17.99, 55, 4, 256, 'Harriman House', 2020, TRUE),

('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.', 13.99, 40, 1, 336, 'Harper Perennial', 2006, FALSE),

('The Pragmatic Programmer', 'David Thomas', '9780135957059', 'Your journey to mastery in software development with timeless advice on coding, testing, and project management.', 44.99, 20, 9, 352, 'Addison-Wesley', 2019, FALSE),

('Guns, Germs, and Steel', 'Jared Diamond', '9780393354324', 'A short history of everybody for the last 13,000 years exploring why civilizations developed differently.', 16.99, 25, 7, 528, 'W. W. Norton', 2017, FALSE),

('Meditations', 'Marcus Aurelius', '9780140449334', 'Personal writings of the Roman Emperor Marcus Aurelius on Stoic philosophy and self-improvement.', 9.99, 70, 8, 256, 'Penguin Classics', 2006, FALSE),

('Zero to One', 'Peter Thiel', '9780804139298', 'Notes on startups, or how to build the future by PayPal co-founder Peter Thiel.', 22.99, 35, 4, 224, 'Currency', 2014, FALSE),

('The Art of War', 'Sun Tzu', '9781599869773', 'An ancient Chinese military treatise that has become one of the most influential strategy texts in the world.', 8.99, 80, 7, 128, 'Canterbury Classics', 2014, FALSE),

('Don''t Make Me Think', 'Steve Krug', '9780321965516', 'A common sense approach to web and mobile usability that has become a classic in the design world.', 35.99, 18, 10, 216, 'New Riders', 2014, FALSE),

('Dune', 'Frank Herbert', '9780441013593', 'A sweeping tale of politics, religion, and ecology set on the desert planet Arrakis.', 14.99, 40, 1, 688, 'Ace', 2005, TRUE),

('Educated', 'Tara Westover', '9780399590504', 'A memoir about a young girl who leaves her survivalist family and goes on to earn a PhD from Cambridge University.', 15.99, 30, 6, 334, 'Random House', 2018, FALSE);
