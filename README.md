<div align="center">

# 🎬 CineScope — Full-Stack Movie Review Platform

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/spring_boot_3.5-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/react_19-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![License](https://img.shields.io/badge/license-MIT-lightgrey?style=for-the-badge)

**A production-grade, full-stack movie review platform with secure auth, watchlists, and paginated reviews — built to demonstrate real REST API design, not just CRUD.**

[🌐 Live Demo](https://cine-scope-fullstack-app.vercel.app/) · [📖 API Docs (Swagger)](#) · [🐛 Report Bug](https://github.com/ananthakrishnan234/CineScope-Fullstack-App/issues)

</div>

---

## 📌 About

CineScope lets users browse movies, view details, rate and review titles, and maintain a personal watchlist. It's built as a showcase of production-quality Spring Boot backend engineering paired with a modern React 19 frontend — the kind of thing that's easy to demo in an interview and easy to read in a code review.

### What makes this more than a typical CRUD demo
- **JWT authentication with refresh tokens**, backed by Spring Security
- **Global exception handling** — consistent, structured error responses across every endpoint
- **DTO layer** — API contracts are decoupled from MongoDB documents, no leaking internal models
- **Paginated, sortable reviews** with optimized MongoDB aggregation pipelines
- **Swagger / OpenAPI docs** — every endpoint is documented and testable from the browser
- **Clean package structure** — controller / service / repository / dto / model / config / exception, no god classes

---

## ✨ Features

| Category | Details |
|---|---|
| 🔐 **Auth** | JWT-based login/register with refresh token rotation, Spring Security filter chain |
| 🎥 **Movies** | Browse, search, and view detailed movie info (poster, storyline, cast) |
| ⭐ **Reviews** | Submit star ratings + written reviews, paginated per movie |
| 📌 **Watchlist** | Add/remove movies to a personal watchlist per user |
| 📖 **API Docs** | Interactive Swagger UI for every endpoint |
| ⚠️ **Error Handling** | Centralized `@ControllerAdvice` returns consistent JSON error shapes |
| 📱 **Responsive UI** | Bootstrap-based layout, works cleanly on mobile |

---

## 🛠️ Tech Stack

**Backend:** Java 17 · Spring Boot 3.5 · Spring Security · Spring Data MongoDB · JWT · Maven · Swagger/OpenAPI
**Frontend:** React 19 · Axios · React Router · Bootstrap 5
**Database:** MongoDB Atlas
**Deployment:** Vercel (frontend) · Render (backend)

---

## 📁 Project Structure

```
CineScope-Fullstack-App/
│
├── Movies-Backend/                     # Spring Boot backend
│   ├── src/main/java/com/cinescope/
│   │   ├── controller/                 # REST controllers
│   │   ├── service/                    # Business logic
│   │   ├── repository/                 # MongoDB repositories
│   │   ├── dto/                        # Request/response DTOs
│   │   ├── model/                      # MongoDB document models
│   │   ├── config/                     # Security & JWT config
│   │   └── exception/                  # Global exception handling
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── Movies-Frontend/                    # React frontend
│   ├── src/
│   │   ├── components/                 # Reusable UI components
│   │   ├── pages/                      # Route-level views
│   │   ├── services/                   # Axios API layer
│   │   └── App.js
│   └── package.json
│
├── Movies.json                         # Sample dataset
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/ananthakrishnan234/CineScope-Fullstack-App.git
cd CineScope-Fullstack-App
```

### 2. Backend setup (Spring Boot + MongoDB Atlas)

Create a `.env` or set the following in `application.properties`:
```properties
spring.data.mongodb.uri=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>/?retryWrites=true&w=majority
spring.data.mongodb.database=cinescopedb
jwt.secret=<YOUR_JWT_SECRET>
jwt.expiration=3600000
```

> ⚠️ Never commit real credentials. Use environment variables in production.

Run the backend:
```bash
cd Movies-Backend
mvn spring-boot:run
```
Backend runs at `http://localhost:8080`
Swagger UI available at `http://localhost:8080/swagger-ui/index.html`

### 3. Frontend setup (React)
```bash
cd Movies-Frontend
npm install
npm start
```
Frontend runs at `http://localhost:3000`

### 4. (Optional) Seed sample data
```bash
mongoimport --uri "<YOUR_MONGO_URI>" --collection movies --file Movies.json --jsonArray
```

---

## 🔑 Sample API Usage

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

Response includes a JWT to authenticate subsequent requests via the `Authorization: Bearer <token>` header. Full endpoint reference is in the Swagger UI.

---

## 🗺️ Roadmap

- [ ] Admin panel for moderating reviews
- [ ] Recommendation engine based on watch history
- [ ] Dockerized deployment
- [ ] CI pipeline with GitHub Actions

---

## 📄 License

Licensed under the MIT License — see [LICENSE](./LICENSE) for details.

---

## 📬 Contact

**Ananthakrishnan Sudhakaran**
📧 [ananthakrishnans234@gmail.com](mailto:ananthakrishnans234@gmail.com) · 💼 [LinkedIn](https://www.linkedin.com/in/ananthakrishnan234/) · 🐙 [GitHub](https://github.com/ananthakrishnan234)

<div align="center">

⭐ If this project helped you, consider giving it a star!

</div>
