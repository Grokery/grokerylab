# grokerylab-api-spring

GrokeryLab RESTful API

Major components:

- [Spring Boot](http://projects.spring.io/spring-boot/) - The foundation of our web app
- [Jersey](https://jersey.java.net/) - The JAX-RS reference implementation for building RESTful web services
- [Swagger](https://github.com/swagger-api/swagger-ui) - The de-facto API documentation framework
- Spring Boot Test Framework (spring-boot-starter-test) with Junit, Hamcrest
- [Rest Assured](https://github.com/rest-assured/rest-assured)


## Building and running locally
Check out this project code and execute below commands:

```json
{
  "accountId": "246ba083-0de3-4a2d-b20b-dc3a7ddcfe22",
  "users": [
    {
      "userId": "246ab083-0dd1-4a2e-b02b-dc3a7ddcfe67",
      "username": "superAdmin@email.com"
    }
  ]
}
```

```json
{
  "accountId": "246ab083-0dd1-4a2e-b02b-dc3a7ddcfe67",
  "accountRole": "superAdmin",
  "name": "Super Admin",
  "password": "$2a$12$tD.M2ZN7.PRV7SmypCob4erEF8NrecVSY4b8b.xUgyw85uFRqivY2",
  "username": "superAdmins@email.com"
}
```

```bash
> cp environments/example.env.config environments/dev.env.config
```

Edit new env config as necessary, then build and run with cmds:

```bash
> mvn package
> java -jar target/grokery-io-lab-0.1.0-SNAPSHOT.jar
```

## Test

To run unit tests

```bash
> mvn test
```

## Swagger UI

Available at:

```web
http://localhost:8000/
```

## Other Helpful notes

To check for pid of process binding port and kill it
```bash
lsof -1:8000
COMMAND   PID  USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
java    19190 hogue  112u  IPv6 0x2095e9e69257b81f      0t0  TCP *:8000 (LISTEN)
kill 19190
```
