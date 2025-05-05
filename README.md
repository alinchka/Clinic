# Clinic Management System

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Система управления клиникой с разделением прав доступа (пациенты/администраторы)

## Функционал

### Для пациентов:
- Регистрация и авторизация
- Запись на прием с выбором даты/времени и врача с бронированием временного слота
- Просмотр и отмена своих записей с освобождением временного слота

### Для администраторов:
- Управление пользователями (CRUD)
- Управление врачами (CRUD)

## Технологии

**Backend:**
- Java 17
- Spring Boot 3.2.5
- Spring Security + JWT
- PostgreSQL
- Spring Data JPA

**Frontend:**
- React 19
- React Router
- Axios
