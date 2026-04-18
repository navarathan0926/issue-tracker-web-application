# System Architecture

## 🏗 High-Level Design

The application follows a client-server architecture:

Client (React) → API (Express) → Database (MySQL)

* Stateless backend using JWT authentication
* RESTful API design

---

## 📁 Folder Structure

### Backend

* routes → API endpoints
* controllers → request handling
* services → business logic
* models → database queries
* middleware → auth & validation

### Frontend

* components → reusable UI elements
* pages → route-level views
* features → Redux slices
* services → API communication layer

---

## 🔄 Data Flow

1. User logs in → JWT issued
2. Token stored in localStorage
3. API requests include token
4. Backend validates token
5. Data fetched from database and returned

---

## 🔁 Status Transition Rules

* OPEN → IN_PROGRESS → RESOLVED
* Backward transitions are not allowed
* Enforced at backend level

---

## 🔍 Search Strategy

* Debounced input on frontend
* Backend handles filtering & querying
* Indexed columns used for performance

---

## 📄 Pagination Strategy

* Offset-based pagination
* Supports infinite scrolling
* Ensures consistent data loading

---

## 🧠 State Management

Redux Toolkit is used for:

* Authentication state
* Issue data

Local component state is used for:

* Search input
* Filters

---

## 🔐 Security Considerations

* Password hashing using bcrypt
* JWT authentication
* Input validation
* SQL injection prevention

⚠️ Note:
JWT is stored in localStorage for simplicity. In production, HttpOnly cookies are recommended.

---

## ⚡ Performance Considerations

* Debounced API calls
* Indexed database queries
* Pagination to limit data load

---

## 📈 Scalability Considerations

* Separation of concerns (controller/service layers)
* Stateless API design
* Easily extendable to microservices
