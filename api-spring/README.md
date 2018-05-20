# grokerylab-api-spring

GrokeryLab RESTful API

Major components:

- [Spring Boot](http://projects.spring.io/spring-boot/)
- [Jersey](https://jersey.java.net/)
- [Swagger](https://github.com/swagger-api/swagger-ui)
- Spring Boot Test Framework (spring-boot-starter-test) with Junit, Hamcrest
- [Rest Assured](https://github.com/rest-assured/rest-assured)


## Building and running locally
Check out this project code and execute below commands:

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

## Notes 

The /core, /common, and /admin code folders in src are identicial to those in the api-serverless project. I've been copy replaceing them to the other project whenever I modify them. I had them in another library project but debuging was a pain and yeah. There's probably a better way but havn't got around to it.


## Other Helpful notes

To check for pid of process binding port and kill it
```bash
lsof -1:8000
COMMAND   PID  USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
java    19190 hogue  112u  IPv6 0x2095e9e69257b81f      0t0  TCP *:8000 (LISTEN)
kill 19190
```
