# 🏛️ SmartHR – Employee Management & Workforce Intelligence System

[![Java](https://img.shields.io/badge/Java-17-orange)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-green)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-red)](https://jwt.io/)

> A **production-style** Java Full Stack HR Management System featuring JWT authentication, role-based access control, skill gap analysis, workforce analytics, and a full audit trail.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **JWT Authentication** | Secure login with BCrypt passwords and JWT tokens |
| 👥 **Employee Management** | Full CRUD with phone, skills, status, joining date |
| 🏢 **Department Management** | Manage departments with employee count |
| 🎯 **Skill Gap Analyzer** | Compare employee skills vs. required skills by designation |
| 📊 **Workforce Analytics** | Dashboard with salary stats, dept distribution, top earner |
| 📋 **Audit Logs** | Track every employee create/update/delete action |
| 🔍 **Advanced Search** | Filter by name, department, designation, salary range |
| 🛡️ **Role-Based Access** | ADMIN / HR / EMPLOYEE role permissions |

---

## 🏗️ Architecture

```
Frontend (React/Vite)     Backend (Spring Boot)
      │                         │
      │ HTTP/REST + JWT          │
      ▼                         ▼
   Axios            Spring MVC Controllers
                         │
                    Spring Security (JWT)
                         │
                    Service Layer
                         │
                    Spring Data JPA
                         │
                      MySQL DB
```

### Backend Package Structure
```
com.smarthr
├── config/          # SecurityConfig, DataInitializer
├── controller/      # REST Controllers (Auth, Employee, Dept, SkillGap, Analytics, AuditLog)
├── dto/             # Request/Response DTOs
├── entity/          # JPA Entities (User, Role, Employee, Department, Skill, AuditLog)
├── exception/       # GlobalExceptionHandler, custom exceptions
├── repository/      # Spring Data JPA interfaces
├── security/        # JwtTokenProvider, JwtAuthFilter, CustomUserDetailsService
├── service/         # Business logic services
└── util/            # AuditLogger utility
```

---

## 🛠️ Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.5
- Spring MVC + Spring Data JPA
- Spring Security + JWT (JJWT 0.11.5)
- MySQL 8.0
- Lombok, Maven

### Frontend
- React 19 + Vite
- React Router v7
- Axios
- Vanilla CSS (custom design system)
- Google Fonts (Inter)

---

## 🗄️ Database Schema

| Table | Description |
|-------|-------------|
| `users` | System users with bcrypt passwords |
| `roles` | ROLE_ADMIN, ROLE_HR, ROLE_EMPLOYEE |
| `user_roles` | Many-to-many join |
| `departments` | IT, HR, Finance, Sales |
| `employees` | Full employee records with dept FK |
| `skills` | Skill master table |
| `employee_skills` | Employee-Skill many-to-many join |
| `audit_logs` | Action audit trail |

---

## 🚀 Setup & Running

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8.0+

### 1. Database Setup
```sql
-- MySQL: create the database (Spring Boot creates tables automatically)
CREATE DATABASE IF NOT EXISTS smarthr_db;
```

### 2. Backend Configuration
Update `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 3. Run the Backend
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```
Backend starts at: **http://localhost:8080**

On first start, sample data is automatically seeded (roles, users, departments, employees).

### 4. Run the Frontend
```bash
cd techcorp-hrms      # (the React project root)
npm install
npm run dev
```
Frontend starts at: **http://localhost:5173**

---

## 🔑 Sample Login Credentials

> ⚠️ **For development/demo only.** Never use these in production.

| Role | Username | Password | Permissions |
|------|----------|----------|-------------|
| ADMIN | `admin` | `admin123` | Full access – all features including audit logs |
| HR | `hruser` | `hr1234` | Add/update/view employees, departments |
| EMPLOYEE | `emp1` | `emp123` | View own profile only |

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register          Register a new user
POST   /api/auth/login             Login → returns JWT token
```

### Employees
```
GET    /api/employees              Get all employees
GET    /api/employees/{id}         Get employee by ID
POST   /api/employees              Create employee (ADMIN/HR)
PUT    /api/employees/{id}         Update employee (ADMIN/HR)
DELETE /api/employees/{id}         Delete employee (ADMIN only)
GET    /api/employees/stats        Dashboard stats
GET    /api/employees/search       Advanced search with filters
GET    /api/employees/paged        Paginated list
```

### Departments
```
GET    /api/departments            Get all departments
GET    /api/departments/{id}       Get department by ID
GET    /api/departments/count      Department count
POST   /api/departments            Create department (ADMIN/HR)
PUT    /api/departments/{id}       Update department (ADMIN/HR)
DELETE /api/departments/{id}       Delete department (ADMIN only)
```

### Skill Gap
```
GET    /api/skill-gap/{employeeId} Analyze skill gap for employee
```

### Analytics
```
GET    /api/analytics/dashboard    Full workforce analytics
```

### Audit Logs
```
GET    /api/audit-logs             All audit entries (ADMIN only)
```

---

## 🎯 Skill Gap Analyzer

The system maps designations to required skills and compares against the employee's actual skill set.

**Example:**

```
Employee: Rahul Verma
Designation: Frontend Developer

Required Skills:    React ✓, JavaScript ✓, HTML ✓, CSS ✓, REST APIs ✗

Matching Skills:    React, JavaScript, HTML, CSS
Missing Skills:     REST APIs

Match Score:        80%
```

Supported designations include: Backend Developer, Full Stack Developer, Frontend Developer, Software Engineer, DevOps Engineer, Data Analyst, HR Manager, Finance Manager, Sales Manager, and more.

---

## 📸 Screenshots

> Add screenshots of your running application here.

| Dashboard | Employees | Skill Analysis |
|-----------|-----------|----------------|
| ![dash]() | ![emp]() | ![skill]() |

---

## 🔮 Future Improvements

- [ ] Payroll management module
- [ ] Leave management system
- [ ] Employee self-service portal
- [ ] Performance review tracking
- [ ] Email notifications (Spring Mail)
- [ ] PDF report export
- [ ] Docker containerization
- [ ] CI/CD pipeline (GitHub Actions)

---

## 📄 License

This project is for educational and portfolio purposes.

---

*Built with ❤️ by Pream Kumar — SmartHR v1.0.0*
