## TypeScript

Install [Bun](https://bun.sh/docs/installation), followed by

```bash
bun main.ts
```

## F#

Install [.NET SDK](https://learn.microsoft.com/en-us/dotnet/core/install/linux-ubuntu-install?tabs=dotnet9&pivots=os-linux-ubuntu-2410), and run

```bash
dotnet new --install Microsoft.DotNet.Web.Spa.ProjectTemplates::*
dotnet new console -lang "F#" -n TreeDemo
```

Copy Program.fs to TreeDemo/Program.fs and run

```bash
dotnet clean
dotnet build
dotnet run
```

There should be 0 errors and 0 warnings.

If you want to toggle F# types, install VS Code Ionide plugin. You may find ["Cannot Toggle Types with Keys"](https://github.com/ionide/ionide-vscode-fsharp/issues/2056) useful.

## ChatGPT Prompts

TypeScript took five iterations, F# worked instantly afterwards.

### Prompt 1

Implement a tree with CRUD operations in TypeScript. Use only recursive types, not a built in list or map. Use functional style, sum types, exhaustive switch with the type never to achieve null safety.

### Prompt 2

Rewrite it so that each node can contain any number of children. Add DFS and BFS traversal functions and use them to visualize a tree compactly with utf8 line symbols. Write a function to create a random tree of a given maximal depth and maximal num of children per node. Write a demo which creates that random tree, then performs say a hundred random CRUD operations and times the execution.

### Prompt 3

Make sure vertical lines connecting the nodes at the same tree depth are not broken and visualization is vertically as compact as possible. Use a "90 degree rotated capital T" utf8 symbol and others to fill all the gaps.

### Prompt 4

Rewrite visualization function so that there are no empty spaces that may occupy entire line in cli. Right now your vertical connections are "broken lines". 

### Prompt 5

You are indenting from left to right correctly, but you are not placing the nodes of the same tree depth vertically as compactly as possible at times. A visualized tree has empty stripes which are just entire empty lines in the terminal which should be deleted to get compactness and connectivity. You are placing utf8 connectors correctly more or less, but occassionally a node at the same tree depth goes one line below than it should, leaving the entire empty line at cli. 

### Prompt 6

Rewrite this in F#. Use idiomatic FP, as much immutability as possible, null safety.

## TypeScript vs F#

- TypeScript:

	```typescript
	const findValue = <T>(tree: Tree<T>, value: T): T | null => { 
	```
- The same line in F#:

	```fsharp
	let rec findValue tree value =
	```
	
- F# with types automatically inferred upon user request:

	```fsharp	
	val findValue: tree : Tree<'a> -> value: 'a (requires equality ) -> option<'a>
	```

## Random Thoughts

- It would certainly be interesting to study more of type inference in action (F#, Rust, Roc?), witness various levels of it, edge cases.

- This demo code does not reveal the cons of type inference, e.g. nasty compiler errors. Gleam uses only generic types for a reason.

- Type annotations are typically written manually in TypeScript and Rust.

- F# looks better, but TypeScript is not bad at all here. 

- TypeScript shows what would happen to Go if we removed pointers, added sum types, imposed default non-nullability on reference types, without going all the way with type constructors and pattern matching.

- Compare the codes yourself and see whether you find TypeScript disgusting, or a decent approximation. The problem is that the answer is unlikely to be found in small code demos. It lies in a deeper experience with type inference and compiler errors. F#/Roc vs Gleam... ChatGPT might have some answers too.

- I was hoping for some immutable trees as mentioned in [Sect. 3.4.1 Persistence and Immutability in A History of Clojure (2020).](https://dl.acm.org/doi/pdf/10.1145/3386321) However, ChatGPT would not do that with a simple prompt formulated above. It would have to be pushed harder, likely with a lot of iterations.
