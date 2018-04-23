FROM frolvlad/alpine-oraclejdk8:slim
VOLUME /tmp
ADD ./grokerylab-api-spring-0.1.0.jar app.jar
RUN sh -c 'touch /app.jar'
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
EXPOSE 8000
