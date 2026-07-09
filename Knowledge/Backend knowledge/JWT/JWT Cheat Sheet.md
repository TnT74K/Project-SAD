Absolutely! Here’s a concise cheat sheet tailored to **your ReserveCenter.API project**. It explains the complete JWT flow without unnecessary details, so your teammates can quickly understand how authentication works.

------

# **JWT Cheat Sheet (ReserveCenter.API)**

## **What is JWT?**

**JWT (JSON Web Token)** is a signed string that proves a user’s identity after they log in.

Instead of storing login sessions on the server, the server gives the client a JWT. The client sends it with every protected request.

------

## **JWT Authentication Flow**

```text
User
 │
 ▼
Login (Phone + Password)
 │
 ▼
POST /auth/login
 │
 ▼
Backend verifies credentials
 │
 ▼
Returns available roles
 │
 ▼
User selects a role
 │
 ▼
POST /auth/select-role
 │
 ▼
GenerateJwtToken()
 │
 ▼
Backend returns JWT
 │
 ▼
Frontend stores JWT
 │
 ▼
Every protected request:
Authorization: Bearer <JWT>
 │
 ▼
ASP.NET validates JWT
 │
 ▼
Controller executes
```

------

# **Where do we create the JWT?**

Inside `AuthService.SelectRoleAsync()`:

```csharp
var token = GenerateJwtToken(user, roleName, orgId);
```

This is the **only place** where a JWT is generated.

------

# **What does** **`GenerateJwtToken()`** **do?**

It creates a signed token containing user information (called **claims**).

Example claims:

```csharp
new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString())
new Claim(JwtRegisteredClaimNames.UniqueName, user.PhoneNumber)
new Claim(ClaimTypes.Role, role)
new Claim("OrgId", orgId.ToString())
```

------

# **What is inside our JWT?**

Conceptually:

```json
{
  "sub": "15",
  "nameid": "15",
  "unique_name": "09123456789",
  "role": "OrgAdmin",
  "OrgId": "3",
  "exp": 1780000000
}
```

The payload is **Base64-encoded, not encrypted**. The signature prevents tampering.

------

# **What happens after the JWT is created?**

The backend returns it:

```json
{
    "token": "eyJhbGc..."
}
```

The backend’s job is finished.

------

# **Where is the JWT stored?**

The **frontend** decides where to store it.

For our university project, the frontend can use:

```javascript
localStorage.setItem("jwt", token);
```

Later:

```javascript
const token = localStorage.getItem("jwt");
```

`localStorage` is a small key-value storage built into every browser.

------

# **How is the JWT sent to the backend?**

Every protected request includes this HTTP header:

```http
Authorization: Bearer eyJhbGc...
```

Example:

```http
GET /api/user/me
Authorization: Bearer eyJhbGc...
```

The frontend automatically attaches the token.

------

# **Does our controller decode the JWT?**

**No.**

[ASP.NET](http://ASP.NET) Core JWT Authentication Middleware automatically:

- Reads the `Authorization` header
- Verifies the signature
- Checks expiration
- Checks issuer
- Checks audience
- Creates `HttpContext.User`

If validation fails:

```http
401 Unauthorized
```

The controller is never executed.

------

# **How do we access JWT data?**

Inside any `[Authorize]` endpoint:

```csharp
var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
var role = User.FindFirstValue(ClaimTypes.Role);
var orgId = User.FindFirst("OrgId")?.Value;
```

No manual decoding is necessary.

------

# **Why do we include** **`NameIdentifier`****?**

[ASP.NET](http://ASP.NET) Core expects:

```csharp
ClaimTypes.NameIdentifier
```

So our JWT includes:

```csharp
new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
```

This lets controllers retrieve the current user’s ID easily.

------

# **Backend vs Frontend Responsibilities**

| **Backend**              | **Frontend**                           |
| ------------------------ | -------------------------------------- |
| Verify login credentials | Send login request                     |
| Generate JWT             | Store JWT (e.g., `localStorage`)       |
| Return JWT               | Include JWT in every protected request |
| Validate incoming JWT    | Read stored JWT before requests        |
| Read claims from `User`  | Handle login/logout UI                 |

------

# **JWT Lifecycle in Our Project**

```text
1. User logs in
        │
        ▼
2. LoginAsync()
        │
        ▼
3. Backend returns available roles
        │
        ▼
4. User selects role
        │
        ▼
5. SelectRoleAsync()
        │
        ▼
6. GenerateJwtToken()
        │
        ▼
7. Backend returns JWT
        │
        ▼
8. Frontend stores JWT
        │
        ▼
9. Frontend sends:
   Authorization: Bearer <JWT>
        │
        ▼
10. ASP.NET validates JWT
        │
        ▼
11. Controller reads claims via User.FindFirstValue(...)
```

------

# **Common Misconceptions**

❌ **The backend stores the JWT.**
 ➡️ No. The frontend stores it.

❌ **The controller decodes the JWT.**
 ➡️ No. [ASP.NET](http://ASP.NET) Core does that automatically.

❌ **The backend sends the JWT with every request.**
 ➡️ No. The frontend sends it in the `Authorization` header.

❌ **JWT is encrypted.**
 ➡️ No. JWT payload is readable; its integrity is protected by a digital signature.

------

This flow matches the implementation you’ve built in `AuthService`, `AuthController`, and your JWT middleware configuration, so your team can use it as a reference while implementing both the backend and frontend.