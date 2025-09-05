# Build stage
FROM maven:latest AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:26-trixie
WORKDIR /app
COPY --from=build /app/target/hr-service.jar hr-service.jar
ENTRYPOINT ["java", "-jar", "hr-service.jar"]