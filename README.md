```
./mvnw clean package
cf create-service p-mysql 100mb-dev account-db
cf push -f account-server/manifest.yml
```