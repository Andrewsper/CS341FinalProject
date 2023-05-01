DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS UserNotifications;
DROP TABLE IF EXISTS Programs;
DROP TABLE IF EXISTS Signed_Up;
DROP TABLE IF EXISTS Owns;

CREATE TABLE Users (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    FirstName varchar(255) NOT NULL,
    LastName varchar(255) NOT NULL,
    Address varchar(255) NOT NULL,
    PhoneNumber varchar(255) NOT NULL,
    Email varchar(255) NOT NULL,
    Password varchar(255) NOT NULL,
    ZipCode varchar(255) NOT NULL, -- 5 digit zip code
    Balance FLOAT NOT NULL, 
    IsStaff BOOLEAN NOT NULL,
    IsMember BOOLEAN NOT NULL,
    IsActive BOOLEAN NOT NULL,
    FamilyID INTEGER NOT NULL
);

CREATE TABLE UserNotifications(
    UserID INTEGER NOT NULL,
    Message TEXT NOT NULL,
    Expiration varchar(255) NOT NULL, -- YYYY-MM-DD
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

CREATE TABLE Programs (
    ProgramID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name varchar(255) NOT NULL,
    Description varchar(255) NOT NULL,
    OfferingDateFrom varchar(255) NOT NULL, -- YYYY-MM-DD (start date)
    OfferingDateTo varchar(255) NOT NULL, -- YYYY-MM-DD (end date)
    Location varchar(255) NOT NULL,
    Price FLOAT NOT NULL,
    Length INTEGER NOT NULL, -- in minutes
    DaysOffered INTEGER(1) NOT NULL, -- 0000001 = Sunday, 0000010 = Monday, etc.
                                     -- Combinations like 0000011 = Sunday and Monday, etc.
    StartTime TEXT NOT NULL, -- 24 hour time 0:00 - 23:59
    MaximumCapacity INTEGER NOT NULL,
    CurrentCapacity INTEGER NOT NULL
);

CREATE TABLE Signed_Up (
    UserID INTEGER NOT NULL,
    ProgramID INTEGER NOT NULL,
    NumRegistered INTEGER NOT NULL, -- multiple people registered under one account
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (ProgramID) REFERENCES Program(ProgramID)
);