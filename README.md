# Workflow Management [Backend Server]
This is the solution of the Backend Assignment from V-Comply Technologies. Please follow the steps to run the application from your localhost.

1. Create an account in [MongoDB Atlas](https://account.mongodb.com/account/login).
2. Create and deploy a free **MongoDB Cluster** in **AWS** with **M0 Sandbox Cluster Tier** and store the **SRV URL** for it.
3. Create a **Network Access** entry with **IP Address** `0.0.0.0/0` to allow access to all **IP Addresses** to the **MongoDB Cluster** you'll be creating soon. Otherwise, if your network has a static **IP Address**, you can also enter it.
3. Create a **Database Access** entry with your desired **Username/Password** and provide the role **readWriteAnyDatabase** to it.
4. The name of the **Database** for this application is `workflow`. I have created the **Database Access** entry with Username `appLink` and Password `aKh89tPXfpghFyQ0`. Hence, the **SRV URL** of my cluster looks like this:
```
mongodb+srv://appLink:aKh89tPXfpghFyQ0@workflow-cluster.gacvl.mongodb.net/workflow?retryWrites=true&w=majority
```

6. Clone the [Workflow-Backend](https://github.com/chego25/workflow-backend) repository and enter into the **Root** folder from your **Command Prompt/Terminal**.
7. Create a `.env` file in the **Root** folder with the following content:

```
DB_URL=<SRV_URL>
BCRYPT=RNcNiNNUo8kKhVcSj2ACLfbIy2C8hjXacm3w0aVsN5mDSIxNC2P844E30at5
TIMEOUT=15m
USER=admin
PASSWORD=admin123
PORT=3000
```
8. Execute the command `npm install` to install all the necessary dependencies for the application.
9. Execute the command `npm run debug` to run the application with `nodemon` or `npm start` to run the application with `node` itself.
10. If your desired port is `3000`, after successful instantiation of the application, the following line should be printed on the **Command Prompt/Terminal**:
```
Server is now listening to port 3000 for API requests.
```

```
mongodump --host atlas-qfpoi6-shard-0/workflow-cluster-shard-00-00.gacvl.mongodb.net:27017,workflow-cluster-shard-00-01.gacvl.mongodb.net:27017,workflow-cluster-shard-00-02.gacvl.mongodb.net:27017 --ssl --username <USERNAME> --password <PASSWORD> --authenticationDatabase admin --db workflow
```

```
mongorestore --host atlas-qfpoi6-shard-0/workflow-cluster-shard-00-00.gacvl.mongodb.net:27017,workflow-cluster-shard-00-01.gacvl.mongodb.net:27017,workflow-cluster-shard-00-02.gacvl.mongodb.net:27017 --ssl --username <USERNAME> --password <PASSWORD> --authenticationDatabase admin
```