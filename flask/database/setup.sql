DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Programs;
DROP TABLE IF EXISTS Signed_Up;
DROP TABLE IF EXISTS Owns;

CREATE TABLE Users (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    Username varchar(255) NOT NULL,
    FirstName varchar(255) NOT NULL,
    LastName varchar(255) NOT NULL,
    Address varchar(255) NOT NULL,
    PhoneNumber varchar(255) NOT NULL,
    Email varchar(255) NOT NULL,
    Password varchar(255) NOT NULL,
    ZipCode INTEGER NOT NULL,
    Balance FLOAT NOT NULL,
    Type TINYINT NOT NULL
);

CREATE TABLE Programs (
    ProgramID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name varchar(255) NOT NULL,
    Description varchar(255) NOT NULL,
    OfferingPeriod varchar(255) NOT NULL,
    Date TEXT NOT NULL,
    Price FLOAT NOT NULL,
    Length INTEGER NOT NULL,
    MaximumCapacity INTEGER NOT NULL,
    CurrentCapacity INTEGER NOT NULL
);

CREATE TABLE Signed_Up (
    UserID INTEGER NOT NULL,
    ProgramID INTEGER NOT NULL,
    FOREIGN KEY (UserID) REFERENCES User(ID),
    FOREIGN KEY (ProgramID) REFERENCES Program(ID)
);

CREATE TABLE Owns (
    UserID INTEGER NOT NULL,
    ProgramID INTEGER NOT NULL,
    FOREIGN KEY (UserID) REFERENCES User(ID),
    FOREIGN KEY (ProgramID) REFERENCES Program(ID)
);



