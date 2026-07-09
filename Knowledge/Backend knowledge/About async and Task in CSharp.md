In C# and .NET, `async` methods and `Task<T>` are the standard way to write non-blocking code.

##### **What `async` means**

- `async` is a keyword you put on a method to say: “this method can use `await`.”
- It does not automatically make code run on a background thread.
- It allows the method to pause while waiting for an operation, then continue later without blocking the current thread.

Example:
```csharp
public async Task<string> GetDataAsync()
{
    var text = await httpClient.GetStringAsync("https://example.com");
    return text;
}
```

Here:
- `async` enables `await`
- `await` waits for the HTTP call without blocking the thread
- the method returns a `Task<string>`

---

###### **Why async methods often start with `Async`**

- This is a C# naming convention, not a language rule.
- Methods that are asynchronous usually end with `Async`, like:
  - `ReadAsync`
  - `SaveAsync`
  - `GetUserAsync`

So people usually write:
```csharp
public async Task<int> CalculateAsync()
```

That makes it easy to recognize async APIs.

---

###### **What `Task` and `Task<T>` are**

- `Task` represents an asynchronous operation that does not return a value.
- `Task<T>` represents an asynchronous operation that returns a value of type `T`.

Think of them like:
- `Task` = “I will finish later”
- `Task<T>` = “I will finish later and give you a value”

Examples:

No return value:
```csharp
public async Task SaveAsync()
{
    await File.WriteAllTextAsync("file.txt", "hello");
}
```

Returns a value:
```csharp
public async Task<int> GetCountAsync()
{
    var text = await File.ReadAllTextAsync("file.txt");
    return text.Length;
}
```

---

###### **How to read `Task<T>`**

If you see:

```csharp
Task<string>
```

it means:
- the method is asynchronous
- when it completes, it produces a `string`

So this:
```csharp
Task<User>
```
means “a future `User`”.

---

###### **How `await` works**

`await` says: “pause here until the task completes, then continue.”

Example:
```csharp
string content = await File.ReadAllTextAsync("notes.txt");
```

Without `await`, you’d just have the task:
```csharp
Task<string> task = File.ReadAllTextAsync("notes.txt");
```

That task is not the string itself; it’s the promise of a string later.

---

###### **Important rules**

- An `async` method usually returns:
  - `Task`
  - `Task<T>`
  - `void` only in special cases, like event handlers
- Most methods should return `Task` or `Task<T>`, not `void`

Why not `async void`?
- You cannot `await` it
- Exceptions are harder to catch
- It is generally only for event handlers

Example event handler:
```csharp
private async void Button_Click(object sender, EventArgs e)
{
    await SaveAsync();
}
```

---

###### **Synchronous vs asynchronous**

Synchronous:

```csharp
public string GetData()
{
    return File.ReadAllText("file.txt");
}
```

This blocks the thread until done.

Asynchronous:
```csharp
public async Task<string> GetDataAsync()
{
    return await File.ReadAllTextAsync("file.txt");
}
```

This lets the thread do other work while waiting.

---

###### **A common mistake**

People sometimes think `async` means “run on another thread.” Not exactly.

For example:
```csharp
await File.ReadAllTextAsync("file.txt");
```

This is asynchronous I/O. It may not use another thread at all while waiting.

If you want CPU-heavy work on a background thread, that is a different thing:
```csharp
await Task.Run(() => HeavyCalculation());
```

---

###### **Returning values**

Use `Task<T>` when the method returns a value.

Examples:
```csharp
public async Task<string> GetNameAsync()
{
    return "Alice";
}
```

```csharp
public async Task<bool> IsValidAsync()
{
    await Task.Delay(100);
    return true;
}
```

If there is no return value:
```csharp
public async Task DoWorkAsync()
{
    await Task.Delay(100);
}
```

---

###### **How to call async methods**

Inside another async method:

```csharp
var name = await GetNameAsync();
```

In a synchronous context, you can sometimes use:
```csharp
var name = GetNameAsync().Result;
```

But this can cause deadlocks or blocking, so it is usually discouraged. Prefer `await` all the way.

---

###### **Quick mental model**

- `async` = this method uses `await`
- `await` = wait without blocking
- `Task` = future completion
- `Task<T>` = future completion with a result of type `T`

If you want, I can also show:
1. how `async`/`await` works step-by-step under the hood
2. common pitfalls like deadlocks and `.Result`
3. examples with ASP.NET, console apps, and UI apps