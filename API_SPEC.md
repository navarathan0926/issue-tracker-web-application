# API Specification

## 🔐 Auth APIs

### POST /auth/register

* Register new user

### POST /auth/login

* Authenticate user and return JWT

---

## 🐞 Issue APIs

### GET /issues

* Get all issues (with filters & pagination)

Query Params:

* search
* status
* priority
* page
* limit

---

### GET /issues/:id

* Get single issue details

---

### POST /issues

* Create new issue

---

### PUT /issues/:id

* Update issue

---

### DELETE /issues/:id

* Delete issue

---

## 📥 Request Example

```
{
  "title": "Bug in login",
  "description": "Login fails",
  "priority": "HIGH"
}
```

---

## 📤 Response Format

```
{
  "success": true,
  "data": {},
  "message": ""
}
```

---

## ❌ Error Format

```
{
  "success": false,
  "message": "Error message"
}
```
