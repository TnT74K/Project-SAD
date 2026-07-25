## Prompt:
We have a system with 5 actors: Customer, Business Admin, System Admin (Super Admin), Business Workers, and Support team. 
We are in a SDLC. And I'm the team manager. I want to make plans and divide the responsibilities among our 5 team members.
We're just students doing this for the first time.
Tell me:
- Should we make 5 use-case diagrams for each of them or make a single united one?
- Should we make a use case diagram for support staff?
- Should we make activity diagrams for all of the use cases?
- Should we make use-case descriptions for each use case?
- How should I divide the responsibilities?

## Answer:
Since you are students doing this for the first time, your primary goal is to learn the concepts while keeping the workload manageable so you don't get overwhelmed. Here is the best approach for a student project:

**1. Should we make 5 use-case diagrams or a single united one?**
Start with **one single united diagram**. Professors usually prefer to see the "big picture" of the whole system in one place. If the diagram gets too messy with lines crossing everywhere, split it into smaller diagrams based on the actors. 

**2. Should we make a use case diagram for support staff?**
Include the Support Staff as an actor in your **united diagram**. You only need to draw them interacting with the specific things they do (like "Reset User Password" or "View Error Logs"). You do not need a completely separate diagram just for them.

**3. Should we make activity diagrams for all of the use cases?**
**Definitely not.** That will take way too much time. Pick **3 to 5** of the most important or complex use cases (for example: "Customer places an order" or "Admin generates monthly report") and make activity diagrams only for those. This shows your professor you know how to create them without burning out your team.

**4. Should we make use-case descriptions for each use case?**
Write a **one-sentence summary** for every use case so you have a complete list. However, write **fully detailed descriptions** (with pre-conditions, main flow, and alternate flows) only for the core features of your app. Usually, writing full descriptions for about 5 to 10 major use cases is enough for a university project.

**5. How should I divide the responsibilities?**
Since you are 5 students and there are 5 actors, the easiest and fairest way to divide the documentation phase is by actor:

*   **Student 1:** Handles the **Customer** (draws their part of the diagram, writes their use case descriptions).
*   **Student 2:** Handles the **Business Admin**.
*   **Student 3:** Handles the **System Admin**.
*   **Student 4:** Handles the **Business Workers**.
*   **Student 5:** Handles the **Support Team**.

*Note on coding/building the system:* Once you finish the diagrams and start coding, you should switch your division of labor. Instead of dividing by actor, divide by technology: have 2 people work on the Frontend (UI/Screens), 2 people on the Backend (Logic/API), and 1 person managing the Database and testing.