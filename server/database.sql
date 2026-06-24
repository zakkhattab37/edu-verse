-- Step 1: Create the database
-- Run this block first, then connect to the new 'eduverse' database before running the rest!
CREATE DATABASE eduverse;

-- Step 2: Connect to the 'eduverse' database in pgAdmin, then run the following:

-- Enable UUID extension (Required for UUID generation in Postgres)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE "enum_Users_role" AS ENUM('Admin', 'Instructor', 'Student');
CREATE TYPE "enum_Courses_status" AS ENUM('Draft', 'Published', 'Archived');

-- Create Users Table
CREATE TABLE "Users" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "role" "enum_Users_role" DEFAULT 'Student',
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create Courses Table
CREATE TABLE "Courses" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "category" VARCHAR(255),
    "status" "enum_Courses_status" DEFAULT 'Draft',
    "instructor_id" UUID REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create Enrollments Table
CREATE TABLE "Enrollments" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "progress" INTEGER DEFAULT 0,
    "student_id" UUID REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "course_id" UUID REFERENCES "Courses" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
