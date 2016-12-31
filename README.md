
Account management integrated with [Maki-UAA](https://github.com/maki-home/uaa)

## Deploy to Cloud Foundry

```
./mvnw clean package
cf create-service p-mysql 100mb-dev account-db
cf push -f account-server/manifest.yml
```

## Screens

![image](https://cloud.githubusercontent.com/assets/106908/21578146/23b41c04-cfb9-11e6-9952-7e35b22ed78e.png)

![image](https://cloud.githubusercontent.com/assets/106908/21578147/280b1082-cfb9-11e6-9b98-c8a343e207c4.png)

![image](https://cloud.githubusercontent.com/assets/106908/21578149/2d8447fe-cfb9-11e6-8faa-f37b1c896592.png)

![image](https://cloud.githubusercontent.com/assets/106908/21578151/31062118-cfb9-11e6-9b28-14b984f474fb.png)
