# grokerylab-api

GrokeryLab RESTful API

Major components:

- [Spring Boot](http://projects.spring.io/spring-boot/)
- [Jersey](https://jersey.java.net/)
- [Swagger](https://github.com/swagger-api/swagger-ui)
- Spring Boot Test Framework (spring-boot-starter-test) with Junit, Hamcrest
- [Rest Assured](https://github.com/rest-assured/rest-assured)


## Building and running locally
After building and installing the api-core lib, execute below commands:

```bash
> cp environments/example.env.config environments/dev.env.config
```

Edit new env config as necessary, then build and run with cmds:

```bash
> ./dockerbuild.sh
> ./dockerrun.sh
```

If you want to run on your local machine you can also

```bash
./run.sh
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
