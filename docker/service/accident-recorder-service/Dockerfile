FROM maven:3.8.5-openjdk-17 AS assembly

WORKDIR /accident-recorder

COPY accident-recorder-service/pom.xml .
RUN mvn dependency:go-offline -B

COPY accident-recorder-service/src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre

WORKDIR /accident-recorder
COPY --from=assembly /accident-recorder/target/accidentrecorder-0.0.1-SNAPSHOT.jar .

CMD ["java", "-jar", "accidentrecorder-0.0.1-SNAPSHOT.jar"]