# Workflow Management [Backend]

This repository contains the solution for the **Backend Assignment** from **V-Comply Technologies**.

> **Author:** Arka Halder, **Email:** arkachego25@gmail.com, **Phone:** (+91) 7595 914 914

## List of Used Libraries/Tools

1. [Node.js](https://nodejs.org/en/)
2. [MongoDB](https://www.mongodb.com/)
3. [Mongoose](https://mongoosejs.com/)
4. [Express](https://expressjs.com/)
5. [Joi](https://hapi.dev/tutorials/validation/?lang=en_US)
6. [Lodash](https://lodash.com/)
7. [Moment](https://momentjs.com/)
8. [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
9. [JWT](https://github.com/auth0/node-jsonwebtoken)
10. [Mocha](https://mochajs.org/)
11. [Chai](https://www.chaijs.com/)
12. [Mochawesome](https://github.com/adamgruber/mochawesome)
13. [VSCode](https://code.visualstudio.com/)
14. [Robo3t](https://robomongo.org/)
15. [Postman](https://www.postman.com/)
16. [Fork](https://git-fork.com/)
17. [Git](https://git-scm.com/)
18. [Github](https://github.com/)

## Steps to run the Application

1. Create an account in [MongoDB Atlas](https://account.mongodb.com/account/login) and login.
2. Create and deploy a free **MongoDB Cluster** in **AWS** with **M0 Sandbox Cluster Tier** and store the **SRV URL** for it.
3. Create a **Network Access** entry with **IP Address** `0.0.0.0/0` to allow access to all **IP Addresses** to the **MongoDB Cluster** you've created. Otherwise, if your network has a static **IP Address**, you can also enter it.
3. Create a **Database Access** entry with your desired **Username/Password** and provide the role **atlasAdmin** to it.
4. The name of the **Database** for this application is `workflow`. I have created the **Database Access** entry with Username `appLink` and Password `aKh89tPXfpghFyQ0`. Hence, the **SRV URL** of my cluster looks like this:
```
mongodb+srv://appLink:aKh89tPXfpghFyQ0@workflow-cluster.gacvl.mongodb.net/workflow?retryWrites=true&w=majority
```

6. Clone the [Workflow-Backend](https://github.com/chego25/workflow-backend) repository and enter into the **Workspace** folder from your **Command Prompt/Terminal**.
7. Create a `.env` file with the following content and replace the **DB_URL** attribute with the **SRV URL** of your **MongoDB Cluster**:

```
DB_URL=<SRV_URL_OF_YOUR_DB>
JWT_KEY=sample-jwt-key
TIMEOUT=15m
USER=admin
PASSWORD=admin123
PORT=3000
```
8. Execute the command `npm install` to install all the necessary dependencies for the application.
9. Execute the command `npm run debug` to run the application with `nodemon` or `npm start` to run it with `node` itself.
10. If your desired port is `3000`, the following line should be printed on the **Command Prompt/Terminal**  after successful instantiation of the application:
```
Server is now listening to port 3000 for API requests.
```
11. To execute the APIs from **Postman**, please import the **Collection** file `postman.json` located inside the **Workspace** folder.
12. To run the **Mocha** test script, execute the command `npm test`. The test result will be available inside the `mochawesome-report` folder in `html` format.

>**IMPORTANT!!!** The test script automatically deletes the database after execution. To hold the status of the database, please comment out the lines `5`, `6`, `7`, `8`, `9`, `10` and `12` in the `5-drop.js` file inside the `test` folder. **To re-run the script after holding the database status, please don't forget to delete the database manually.**