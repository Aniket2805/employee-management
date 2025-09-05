# Build stage
FROM maven:latest AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:26-trixie
WORKDIR /app
COPY --from=build /app/target/security-service.jar security-service.jar
ENTRYPOINT ["java", "-jar", "security-service.jar"]