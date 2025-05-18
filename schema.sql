CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('teacher', 'student')) NOT NULL
);

CREATE TABLE journals (
    id SERIAL PRIMARY KEY,
    description TEXT,
    attachment_type VARCHAR(10),
    attachment_path TEXT,
    published_at TIMESTAMP,
    is_published BOOLEAN DEFAULT FALSE,
    created_by INTEGER REFERENCES users(id)
);

CREATE TABLE journal_students (
    journal_id INTEGER REFERENCES journals(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (journal_id, student_id)
);
