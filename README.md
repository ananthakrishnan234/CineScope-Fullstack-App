

# Movies App (Spring Boot + React)  

React JavaScript Spring-Boot REST-API Bootstrap MongoDB License  

A full-stack Movies App built with React (frontend) and Spring Boot (backend).  
It allows users to browse movies, watch trailers, and add reviews.  
Perfect for showcasing full-stack development, REST API integration, and responsive UI design.  

---

## Features
- **Browse Movies** – Display a carousel of trending movies.  
- **Movie Details** – View detailed info like title, poster, and storyline.  
- **Watch Trailers** – Embedded trailer player for each movie.  
- **Submit Reviews** – Add and manage movie reviews stored in MongoDB.  
- **Responsive Design** – Styled with Bootstrap for mobile-friendly UI.  
- **Full-Stack Integration** – Seamless linkage between React frontend and Spring Boot backend.  

---

## Project Structure
```
Fullstack-Movies-App/
│
├── movie-backend/            # Spring Boot backend
│   ├── src/main/java/...     # REST API controllers, services, models
│   ├── pom.xml               # Maven dependencies
│   └── application.properties# DB + server config
│
├── movie-frontend/           # React frontend
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page-level views (Home, Trailer, Reviews)
│   │   ├── App.js            # Main app
│   │   └── index.js          # ReactDOM render
│   ├── package.json          # Frontend dependencies
│   └── public/               # Static assets
│
├── movies.json               # Sample dataset (movies, trailers, reviews)
├── README.md
└── .gitignore
```

---

## Setup Instructions

### 1 Clone the Repository
```bash
git clone https://github.com/ananthakrishnan234/Fullstack-Movies-App.git
cd Fullstack-Movies-App
```

---

### 2 Backend Setup (Spring Boot + MongoDB Atlas)

#### Configure MongoDB Atlas
1. Create a **MongoDB Atlas cluster**.  
2. Add your credentials in `application.properties`:  

```properties
spring.data.mongodb.database=moviesdb
spring.data.mongodb.uri=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>/?
retryWrites=true&w=majority
```

*(Replace `<USERNAME>`, `<PASSWORD>`, and `<CLUSTER>` with your own details.)*  

#### Import Initial Dataset
Use the sample dataset to preload movies and reviews into MongoDB:  
```bash
mongoimport --uri "mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>/moviesdb" \
  --collection movies --file movies.json --jsonArray
```

#### Run Backend
```bash
cd movie-backend
mvn spring-boot:run
```

The backend will run at **http://localhost:8080/**  

---

### 3 Frontend Setup (React)

```bash
cd movie-frontend
npm install
npm start
```

The frontend will run on **http://localhost:3000/**  

---

## Example User Flow
1. Open the app → See a list of trending movies.  
2. Click a movie → View details, storyline, and poster.  
3. Watch trailer → Embedded player opens in a new page.  
4. Submit review → Add feedback stored in MongoDB and instantly visible.  

---

## Technologies Used
- React 18  
- JavaScript (ES6+)  
- Bootstrap 5  
- Axios (for API calls)  
- React Router DOM  
- Spring Boot 3  
- MongoDB Atlas  

---

## License
This project is licensed under the MIT License – see the LICENSE file for details.  

---

## Contact
**Ananthakrishnan Sudhakaran**  
 Email: [ananthakrishnans234@gmail.com](mailto:ananthakrishnans234@gmail.com)  
 GitHub: [ananthakrishnan234](https://github.com/ananthakrishnan234)  
 LinkedIn: [Ananthakrishnan Sudhakaran](https://www.linkedin.com/in/ananthakrishnan-sudhakaran)  
