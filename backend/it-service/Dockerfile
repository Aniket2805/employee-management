# Build stage
FROM maven:latest AS build
WORKDIR /app

#Copy the pom.xml and install dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

#Copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:26-trixie
WORKDIR /app
COPY --from=build /app/target/it-service.jar .

EXPOSE 8082
ENTRYPOINT ["java", "-jar", "it-service.jar"]