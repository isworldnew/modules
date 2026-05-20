FROM maven:3.9.6-eclipse-temurin-21 AS assembly

WORKDIR /accident-recorder

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre

ENV TZ=Europe/Saratov
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /accident-recorder
COPY --from=assembly /accident-recorder/target/accidentrecorder-0.0.1-SNAPSHOT.jar .

CMD ["java", "-Duser.timezone=Europe/Saratov", "-jar", "accidentrecorder-0.0.1-SNAPSHOT.jar"]