FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=build /app/target/springboot-backend-*.jar app.jar

ENV SPRING_PROFILES_ACTIVE=production
ENV DB_URL=jdbc:postgresql://db:5432/clinic
ENV DB_USERNAME=postgres
ENV DB_PASSWORD=postgres
ENV JWT_SECRET=your-strong-secret-key-here
ENV JWT_EXPIRATION_MS=86400000

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]