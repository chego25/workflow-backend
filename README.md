# README
```
DB_URL=mongodb+srv://appLink:aKh89tPXfpghFyQ0@workflow-cluster.gacvl.mongodb.net/
DB_PARAM=?retryWrites=true&w=majority
BCRYPT=RNcNiNNUo8kKhVcSj2ACLfbIy2C8hjXacm3w0aVsN5mDSIxNC2P844E30at5
TIMEOUT=15m
PORT=3000
USER=admin
PASSWORD=admin123
```

```
mongodump --host atlas-qfpoi6-shard-0/workflow-cluster-shard-00-00.gacvl.mongodb.net:27017,workflow-cluster-shard-00-01.gacvl.mongodb.net:27017,workflow-cluster-shard-00-02.gacvl.mongodb.net:27017 --ssl --username <USERNAME> --password <PASSWORD> --authenticationDatabase admin --db workflow
```

```
mongorestore --host atlas-qfpoi6-shard-0/workflow-cluster-shard-00-00.gacvl.mongodb.net:27017,workflow-cluster-shard-00-01.gacvl.mongodb.net:27017,workflow-cluster-shard-00-02.gacvl.mongodb.net:27017 --ssl --username <USERNAME> --password <PASSWORD> --authenticationDatabase admin
```