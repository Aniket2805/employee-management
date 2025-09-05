# Build stage
FROM maven:latest AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:26-trixie
WORKDIR /app
COPY --from=build /app/target/registry-service.jar registry-service.jar
ENTRYPOINT ["java", "-jar", "registry-service.jar"]