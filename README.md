# README

```
mongodump --host atlas-qfpoi6-shard-0/workflow-cluster-shard-00-00.gacvl.mongodb.net:27017,workflow-cluster-shard-00-01.gacvl.mongodb.net:27017,workflow-cluster-shard-00-02.gacvl.mongodb.net:27017 --ssl --username <USERNAME> --password <PASSWORD> --authenticationDatabase admin --db workflow
```

```
mongorestore --host atlas-qfpoi6-shard-0/workflow-cluster-shard-00-00.gacvl.mongodb.net:27017,workflow-cluster-shard-00-01.gacvl.mongodb.net:27017,workflow-cluster-shard-00-02.gacvl.mongodb.net:27017 --ssl --username <USERNAME> --password <PASSWORD> --authenticationDatabase admin
```