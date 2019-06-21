FROM openjdk:8-jdk-alpine
VOLUME /tmp
ADD ./grokerylab-api-spring-0.1.0.jar application.jar
RUN sh -c 'touch /application.jar'
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/application.jar"]
EXPOSE 8000
