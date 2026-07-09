You're very welcome! I'm glad that fixed the issue. Since you're a Team Lead and developer, I've organized this cheatsheet to be concise and focused on the workflow commands you'll actually use day-to-day.

### .NET CLI Cheatsheet

#### 🚀 Execution & Hot Reload
| Command             | Description                                                 |
| :------------------ | :---------------------------------------------------------- |
| `dotnet run`        | Runs the project from source code.                          |
| `dotnet watch`      | Starts the project and reloads automatically on file saves. |
| `dotnet watch run`  | Most common: Watch for changes and re-run.                  |
| `dotnet watch test` | Watch for changes and re-run tests automatically.           |

#### 🧹 Maintenance & Troubleshooting
| Command                         | Description                                                  |
| :------------------------------ | :----------------------------------------------------------- |
| `dotnet clean`                  | Deletes build output files (`bin` and `obj`).                |
| `dotnet restore`                | Restores dependencies specified in the project file.         |
| `dotnet build`                  | Compiles the project without running it.                     |
| `dotnet build --no-incremental` | Forces a full rebuild (ignores cached artifacts).            |
| `killall dotnet`                | **(The "Nuclear Option")**: Forcefully terminates all running .NET processes. |

#### 📦 NuGet Package Management
| Command                        | Description                                        |
| :----------------------------- | :------------------------------------------------- |
| `dotnet add package <Name>`    | Adds a NuGet package to your project.              |
| `dotnet remove package <Name>` | Removes a NuGet package.                           |
| `dotnet list package`          | Lists all dependencies and their current versions. |

#### 🧪 Testing
| Command                              | Description                                 |
| :----------------------------------- | :------------------------------------------ |
| `dotnet test`                        | Runs all tests in the solution.             |
| `dotnet test --filter Category=Unit` | Runs only tests matching a specific filter. |

#### 🛠️ Project & Solution Management
| Command                       | Description                           |
| :---------------------------- | :------------------------------------ |
| `dotnet sln add <Path>`       | Adds a project file to the solution.  |
| `dotnet sln remove <Path>`    | Removes a project from the solution.  |
| `dotnet new sln`              | Creates a new solution file (`.sln`). |
| `dotnet new webapi -n <Name>` | Creates a new Web API project.        |

---

### Pro-Tip: Advanced Build Analysis
Since you mentioned performance issues, keep this command in your back pocket. It generates a diagnostic log that identifies exactly which part of your build process is dragging:

```bash
dotnet build -clp:PerformanceSummary
```

*This will output a table at the very end showing the execution time of each build task.*