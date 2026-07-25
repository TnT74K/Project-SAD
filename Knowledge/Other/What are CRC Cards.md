# What are CRC Cards?

(AI-generated Answer)

CRC Cards (**Class–Responsibility–Collaborator**) are used during object-oriented analysis and design to discover classes before drawing the class diagram.

To answer your questions:

### **1. What should we write in the “Type” field?**

Different instructors use different CRC templates. Usually “Type” means the role of the class.

Common types are:

| **Type** | **Meaning**                                                  |
| -------- | ------------------------------------------------------------ |
| Entity   | Represents business data (User, Product, Order, Course, etc.) |
| Boundary | Interacts with actors (UI pages, forms, APIs)                |
| Control  | Coordinates logic and workflows (AuthenticationController, OrderManager, etc.) |

Example:

| **Class**              | **Type** |
| ---------------------- | -------- |
| Student                | Entity   |
| Login Page             | Boundary |
| Authentication Manager | Control  |

To determine the type:

- If it mainly stores information → **Entity**
- If it communicates with users or external systems → **Boundary**
- If it controls a process/use case → **Control**

Some universities simplify this and only use “Entity” for most domain classes. Check your instructor’s examples.

------

### **2. Should IDs be the same as Use Case IDs?**

Usually **no**.

Use Cases and CRC Cards are different artifacts.

Example:

Use Cases:

- UC-01 Login
- UC-02 Register
- UC-03 Submit Request

CRC Cards:

- CRC-01 User
- CRC-02 Request
- CRC-03 AuthenticationService

The IDs are normally independent.

------

### **3. Which objects should we make CRC cards for?**

Not actors.

Not use cases.

You make CRC cards for **candidate classes** that appear in the system.

A good way is:

1. Read use case descriptions.
2. Underline important nouns.
3. Convert meaningful nouns into candidate classes.

Example:

Use case:

Student submits a request to the department.

Possible classes:

- Student
- Request
- Department

Not classes:

- Submit (verb)
- Login successfully (action)

You usually create CRC cards for:

- Business entities
- Important controllers/services
- Sometimes boundary classes

You generally do **not** create CRC cards for:

- Actors
- Use cases themselves
- Every noun you see

------

### **4. Are CRC Cards the same as what we will write in the class diagram?**

They are related, but not identical.

CRC cards come **before** the class diagram.

CRC helps you discover:

- Classes
- Responsibilities
- Collaborators

Then you convert those ideas into a class diagram.

Example CRC:

| **Class**        | **Student**                   |
| ---------------- | ----------------------------- |
| Responsibilities | Submit request, View requests |
| Collaborators    | Request                       |

This may become a class diagram like:

```text
Student
---------
StudentId
Name
---------
SubmitRequest()
ViewRequests()

1 ----- * Request
```

Notice:

- Responsibilities often become methods.
- Collaborators often become associations.
- Attributes may be added later.

So:

**CRC = brainstorming/discovery tool**
 ➡️
 **Class Diagram = formal UML model**

The final class diagram usually contains fewer mistakes because CRC cards helped you think about responsibilities first.

If you send the image/template your instructor gave you, I can explain exactly how each field should be filled according to that specific CRC format.