# CS341FinalProject
CS341 Final Project YMCA Program Registration Software

Python
Mongo Db (no sql)

Gui Options:
Flask?
Replit?
Tkinter?

Packages
=======================
https://docs.python.org/3/library/calendar.html calendar
https://www.mongodb.com/docs/drivers/pymongo/#pymongo PyMongo 

Running docker container with Nginx proxy, MongoDB, Flask

To get working install docker (sudo apt install docker)

cd to project directory

I needed sudo to get proper permissions for these, maybe you won't:

```console
docker compose up -d
```

should be running on http://localhost:80

To end container: 
```console
docker compose down
```
