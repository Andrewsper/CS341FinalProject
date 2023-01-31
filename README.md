# CS341FinalProject
CS341 Final Project YMCA Program Registration Software

Python

Mongo Db (no sql)
https://www.mongodb.com/try/download/community

In order to share the same mongoDB we will need to import and export changes as JSON each time an edit is made
See below link to so how
https://stackoverflow.com/questions/11255630/how-to-export-all-collections-in-mongodb

Backend : Flask 
Frontend : Angular

Packages
=======================
https://docs.python.org/3/library/calendar.html calendar
https://www.mongodb.com/docs/drivers/pymongo/#pymongo PyMongo 

Running docker container with Nginx proxy, MongoDB, Flask

To get working install docker (sudo apt install docker)

cd to project directory

add docker to sudo groups or just use sudo every time

```console
docker compose up -d
```

should be running on http://localhost:4200

To end container: 
```console
docker compose down
```
