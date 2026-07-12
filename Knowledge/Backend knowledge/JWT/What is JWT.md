Since you’re about to implement authentication in an **ASP.NET Core Web API**, understanding **JWT** is one of the most important prerequisites. Think of JWT as the mechanism that allows your backend to recognize **who the client is** without having to remember them.

------

# **The Problem JWT Solves**

Imagine a user logs in.

```
Email: sajad@example.com
Password: ********
```

The server verifies the credentials.

Now what?

How does the server know that the next request also comes from the same user?

There are two common approaches:

### **1. Session-based authentication (traditional)**

The server stores a session.

```
Server
│
├── Session #1234
│     User = Sajad
│
└── Session #5678
      User = Alice
```

The browser stores only a session ID.

Every request:

```
GET /appointments

Cookie:
SessionId = 1234
```

The server looks up session **1234**.

This requires the server to **remember every logged-in user**.

------

### **2. Token-based authentication (JWT)**

Instead of storing a session…

The server gives the client a signed token.

```
Client
│
└── JWT Token
```

Every request sends the token:

```
GET /appointments

Authorization:
Bearer eyJhbGc...
```

The server verifies the token.

No session lookup is required.

The server is essentially saying:

“If this token is valid and I signed it, I know who you are.”

------

# **What is JWT?**

JWT stands for

**JSON Web Token**

It’s simply a **compact string** that contains information about the authenticated user.

Example:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJzdWIiOiIxMjMiLCJuYW1lIjoiU2FqYWQiLCJyb2xlIjoiQWRtaW4ifQ
.
K8Q7...
```

Looks random…

But it’s actually three Base64URL-encoded parts.

```
Header
.
Payload
.
Signature
```

------

# **JWT Structure**

```
xxxxx.yyyyy.zzzzz
```

## **1. Header**

Describes the token.

Example:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Meaning:

- algorithm = HS256
- type = JWT

------

## **2. Payload**

Contains **claims**.

Claims are pieces of information about the user.

Example:

```json
{
  "sub": "123",
  "name": "Sajad",
  "role": "Admin",
  "exp": 1783251000
}
```

Meaning:

| **Claim** | **Meaning**     |
| --------- | --------------- |
| sub       | User ID         |
| name      | Username        |
| role      | User role       |
| exp       | Expiration time |

The payload is **not encrypted**—it’s only encoded. Anyone who has the token can decode it and read these claims, so don’t put secrets like passwords in it.

------

## **3. Signature**

This is the important part.

The server computes something like:

```
HMACSHA256(
    Header + Payload,
    SecretKey
)
```

The result becomes the signature.

```
Header
+
Payload
+
Signature
```

Now nobody can modify the payload.

If someone changes:

```
Role = User
```

to

```
Role = Admin
```

the signature no longer matches.

The server immediately rejects the token.

------

# **What Happens During Login?**

Suppose your database contains:

```
User
----
Id = 17
Email = sajad@example.com
PasswordHash = ...
Role = Admin
```

------

### **Step 1**

Client sends

```
POST /login
{
    "email": "sajad@example.com",
    "password": "123456"
}
```

------

### **Step 2**

Server verifies password.

If correct…

------

### **Step 3**

Server creates a JWT.

Payload:

```json
{
    "sub": "17",
    "email": "sajad@example.com",
    "role": "Admin"
}
```

Signs it.

Returns:

```json
{
    "token": "eyJhbGc..."
}
```

------

### **Step 4**

Client stores the token (commonly in memory or secure storage, depending on the type of client).

------

### **Step 5**

Future requests include:

```
Authorization: Bearer eyJhbGc...
```

------

### **Step 6**

The server:

- verifies the signature
- checks whether the token has expired
- extracts the claims
- identifies the user

No database lookup is required just to determine the user’s identity.

------

# **What are Claims?**

Claims are pieces of identity information inside the token.

Example:

```json
{
    "sub": "17",
    "role": "Receptionist",
    "email": "a@b.com"
}
```

ASP.NET Core turns them into a `ClaimsPrincipal`.

Then your controllers can access them, for example:

```csharp
User.Identity.Name

User.FindFirst("sub")

User.FindFirst(ClaimTypes.Role)
```

This is how your application knows who is making the request.

------

# **Why Doesn’t the Server Need Sessions?**

Because the token already contains the user’s identity.

Every request carries:

```
I am user 17.

My role is Admin.

This token expires tomorrow.

The server signed it.
```

The server only verifies the signature.

That’s enough.

This is why JWT authentication is called **stateless authentication**: the server doesn’t maintain per-user session state between requests.

------

# **Where Does ASP.NET Core Fit?**

Your authentication flow will typically look like this:

```
Client
   │
   │ POST /login
   ▼
AuthController
   │
   ▼
AuthService
   │
   ├── Validate email/password
   ├── Generate JWT
   └── Return token
```

For protected endpoints:

```
Client
    │
    │ Authorization: Bearer <JWT>
    ▼
Authentication Middleware
    │
    ├── Validate signature
    ├── Check expiration
    ├── Read claims
    ▼
Controller
```

The authentication middleware performs the token validation before your controller action runs. If the token is invalid or missing (for an endpoint protected with `[Authorize]`), the request is rejected automatically.

------

# **JWT in Your Reservation System**

For your reservation system, a token might contain claims such as:

```json
{
    "sub": "42",
    "email": "doctor@example.com",
    "role": "Doctor",
    "clinicId": "5",
    "exp": 1783251000
}
```

Then you can protect endpoints with role-based authorization:

```csharp
[Authorize(Roles = "Doctor")]
public IActionResult GetMyAppointments()
```

or

```csharp
[Authorize(Roles = "Receptionist")]
public IActionResult CreateAppointment()
```

ASP.NET Core will validate the JWT and ensure only users with the appropriate role can access those endpoints.

------

## **A mental model**

Think of a JWT like a **digitally signed ID card**:

- **Header** → What kind of ID card it is.
- **Payload** → The information printed on the card (user ID, role, expiration).
- **Signature** → The official seal that proves the issuer created it and that it hasn’t been altered.

The server doesn’t need to remember every ID card it has issued. It only needs its secret signing key to verify that the card is authentic. This is what makes JWT authentication efficient and well suited to modern REST APIs.