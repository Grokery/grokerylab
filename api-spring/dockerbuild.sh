
mvn clean package

cp target/grokerylab-api-spring-0.1.0.jar docker

docker build -t grokerylab docker
