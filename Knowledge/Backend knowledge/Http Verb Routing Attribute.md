In C# ASP.NET Core development, `[HttpPost("something")]` is a fundamental construct. Since you are working as a developer/team lead, I will break this down from an architectural and implementation perspective.

---

### 1. What are they called?
Technically, these are called **Attributes**. 

Specifically, in the context of ASP.NET Core, `[HttpPost]` is an **Action Method Selector** (or an **HTTP Verb Routing Attribute**). 
*   **Attributes:** Metadata added to classes or methods to define their behavior.
*   **Routing Attributes:** These dictate how the routing engine maps an incoming HTTP request URI to a specific C# method inside a Controller.

### 2. Where is it used?
It is used within **Controller classes** in ASP.NET Core Web API or MVC applications. Its purpose is to explicitly tell the framework: *"Only execute this specific C# method if the incoming request is an **HTTP POST** and matches the specified route template."*

### 3. How to use it?
When you define `[HttpPost("something")]`, the string inside the parentheses sets a "Route Template." This extends the base route of your controller.

#### Example Implementation
Imagine you have a `UserController`.

```csharp
[ApiController]
[Route("api/[controller]")] // Base route: api/user
public class UserController : ControllerBase
{
    // The full path to this method will be: POST /api/user/something
    [HttpPost("something")]
    public IActionResult CreateUser([FromBody] UserDto userData)
    {
        if (userData == null) return BadRequest();
        
        // Logic to save data...
        return Ok(new { message = "User created successfully", user = userData.Name });
    }
}
```

#### Key components in the example:
*   **`[HttpPost("something")]`**: Defines the HTTP method (POST) and the URI segment (`/something`). Without this, the framework would use convention-based routing (e.g., method name).
*   **`[FromBody]`**: Since POST requests usually carry a payload (JSON), you must explicitly tell the model binder to look inside the request body for the `userData` object, rather than the query string.
*   **`IActionResult`**: The standard return type that allows you to return HTTP status codes (200 OK, 400 Bad Request, 201 Created, etc.).

---

### Why use this approach (Lead Perspective)?

1.  **Semantic Clarity:** It aligns your code with RESTful principles. POST is for creating state or submitting data that is too complex for URL query parameters.
2.  **Security/Payload:** Unlike GET requests, where data is visible in the URL, POST sends data in the request body, which is essential for sensitive information (passwords, large documents, or complex objects).
3.  **Routing Flexibility:** By using the attribute, you decouple your C# method name from your public API endpoint. You could name your C# method `HandleUserRegistration()`, but expose it to the client as `/api/user/something`, and if you decide to change the endpoint, you only change the attribute, not the method signature.

### Quick Comparison
*   **`[HttpGet("something")]`**: The client retrieves data.
*   **`[HttpPost("something")]`**: The client sends data to be processed/stored.
*   **`[HttpPut("something")]`**: The client updates an existing resource.
*   **`[HttpDelete("something")]`**: The client removes a resource.

Does this align with the architecture you are currently building for your team, or were you looking for how this integrates into a specific design pattern (like CQRS)?