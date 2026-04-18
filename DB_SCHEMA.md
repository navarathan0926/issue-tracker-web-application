# Database Schema

## 🧱 Tables

### Users

* id (PK)
* email (UNIQUE)
* password_hash
* created_at
* updated_at

---

### Issues

* id (PK)
* title
* description
* status (ENUM: OPEN, IN_PROGRESS, RESOLVED)
* priority (ENUM: LOW, MEDIUM, HIGH)
* user_id (FK)
* created_at
* updated_at

---

## 🔗 Relationships

* One user → many issues

---

## 🔒 Constraints

* user_id → foreign key
* status → ENUM
* priority → ENUM
* title → NOT NULL

---

## ⚡ Indexing Strategy

* user_id → for user-specific queries
* status → for filtering
* priority → for filtering
* created_at → for sorting
* title → for search

---

## 🧠 Design Decisions

* Normalized schema for clarity and scalability
* ENUM used for controlled values
* Status transitions handled in backend logic
* Raw SQL used instead of ORM for better control

---

## 🔮 Future Improvements

* Full-text search
* Issue comments
* Audit logs for status changes
