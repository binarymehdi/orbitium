import { useState } from "react";
import Editor from "@monaco-editor/react";
import LanguageSelector from "./language-selector";

const codeTemplates = [
  {
    language: "javascript",
    filename: "database-query.js",
    code: `// Node.js database query using Prisma ORM
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new user
const user = await prisma.user.create({
  data: {
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 28,
    profile: {
      create: {
        bio: 'Software developer passionate about clean code'
      }
    }
  }
});

console.log('Created user:', user);

// Alternative using raw SQL with mysql2
const mysql = require('mysql2/promise');
const connection = await mysql.createConnection(config);
const [rows] = await connection.execute(
  'SELECT * FROM users WHERE age > ? AND active = ?',
  [25, true]
);`,
  },
  {
    language: "python",
    filename: "database_query.py",
    code: `# Python database query using SQLAlchemy ORM
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Create user
user = User(
    name='Jane Smith',
    email='jane@example.com',
    age=28,
    active=True
)
session.add(user)
session.commit()

# Query users
users = session.query(User).filter(
    User.age > 25,
    User.active == True
).all()

# Alternative using raw SQL with psycopg2
import psycopg2
conn = psycopg2.connect(database="mydb", user="user", password="pass")
cur = conn.cursor()
cur.execute("SELECT * FROM users WHERE age > %s AND active = %s", (25, True))
results = cur.fetchall()`,
  },
  {
    language: "go",
    filename: "database_query.go",
    code: `package main

import (
    "database/sql"
    "fmt"
    _ "github.com/lib/pq"
)

type User struct {
    ID     int    \`db:"id"\`
    Name   string \`db:"name"\`
    Email  string \`db:"email"\`
    Age    int    \`db:"age"\`
    Active bool   \`db:"active"\`
}

func main() {
    db, err := sql.Open("postgres", "postgres://user:pass@localhost/dbname?sslmode=disable")
    if err != nil {
        panic(err)
    }
    defer db.Close()
    
    // Insert user
    _, err = db.Exec(\`
        INSERT INTO users (name, email, age, active) 
        VALUES ($1, $2, $3, $4)\`,
        "Jane Smith", "jane@example.com", 28, true)
    
    // Query users
    rows, err := db.Query(\`
        SELECT id, name, email, age, active 
        FROM users WHERE age > $1 AND active = $2\`,
        25, true)
    defer rows.Close()
    
    for rows.Next() {
        var user User
        rows.Scan(&user.ID, &user.Name, &user.Email, &user.Age, &user.Active)
        fmt.Printf("User: %+v\\n", user)
    }
}`,
  },
  {
    language: "ruby",
    filename: "database_query.rb",
    code: `# Ruby database query using ActiveRecord ORM
class User < ApplicationRecord
  has_one :profile
  validates :email, presence: true, uniqueness: true
  scope :active_adults, -> { where('age > ? AND active = ?', 25, true) }
end

# Create user with profile
user = User.create!(
  name: 'Jane Smith',
  email: 'jane@example.com',
  age: 28,
  active: true
)

user.create_profile!(bio: 'Software developer passionate about clean code')

# Query users
active_adults = User.active_adults.includes(:profile)

# Alternative using raw SQL with ActiveRecord
users = User.find_by_sql([
  'SELECT u.*, p.bio FROM users u 
   LEFT JOIN profiles p ON u.id = p.user_id 
   WHERE u.age > ? AND u.active = ?',
  25, true
])

# Using Arel for complex queries
User.joins(:profile)
    .where(User.arel_table[:age].gt(25))
    .where(active: true)
    .select('users.*, profiles.bio')`,
  },
];

const CodeEditor = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [codeValues, setCodeValues] = useState(() => {
    const initialValues: Record<string, string> = {};
    codeTemplates.forEach((item) => {
      initialValues[item.language] = item.code;
    });
    return initialValues;
  });

  const currentCode = codeValues[selectedLanguage] || "";
  const currentFilename =
    codeTemplates.find((item) => item.language === selectedLanguage)?.filename || "";

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };
  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCodeValues((prev) => ({
        ...prev,
        [selectedLanguage]: value,
      }));
    }
  };

  const getMonacoLanguage = (lang: string) => {
    switch (lang) {
      case "javascript":
        return "javascript";
      case "python":
        return "python";
      case "go":
        return "go";
      case "ruby":
        return "ruby";
      default:
        return "plaintext";
    }
  };

  return (
    <div className="py-10">
      <div className="flex w-full flex-col gap-1 overflow-hidden">
        <div className="bg-muted/40 w-full rounded-md border">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <div className="text-muted-foreground text-sm font-medium">
              {currentFilename}
            </div>
            <LanguageSelector
              value={selectedLanguage}
              onValueChange={handleLanguageChange}
            />
          </div>

          <div className="m-1 h-132 rounded-2xl">
            <Editor
              height="100%"
              language={getMonacoLanguage(selectedLanguage)}
              value={currentCode}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                renderWhitespace: "selection",
                tabSize: 2,
                insertSpaces: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
