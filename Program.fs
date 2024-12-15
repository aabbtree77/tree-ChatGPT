// Define a recursive Tree type
type Tree<'T> =
    | Leaf
    | Node of 'T * Tree<'T> list

// Create a Leaf factory function
let leaf<'T> : Tree<'T> = Leaf

// Create a Node factory function
let node value children : Tree<'T> = Node(value, children)

// CRUD Operations

// Create a new tree with a single value
let createTree value : Tree<'T> = node value []

// Read a value in the tree by traversing (returns None if not found)
let rec findValue tree value =
    match tree with
    | Leaf -> None
    | Node(v, children) ->
        if v = value then Some v
        else
            children
            |> List.tryPick (fun child -> findValue child value)

// Insert a value into the tree (returns a new tree, preserving immutability)
let rec insertValue tree value =
    match tree with
    | Leaf -> node value []
    | Node(v, children) -> node v (children @ [node value []])

// Delete a value from the tree (returns a new tree, preserving immutability)
let rec deleteValue tree value =
    match tree with
    | Leaf -> Leaf
    | Node(v, children) ->
        if v = value then
            match children with
            | [] -> Leaf
            | hd :: _ -> hd
        else
            node v (children |> List.map (fun child -> deleteValue child value))

// Depth-First Search (DFS) traversal
let rec dfs tree visit =
    match tree with
    | Leaf -> ()
    | Node(value, children) ->
        visit value
        children |> List.iter (fun child -> dfs child visit)

// Breadth-First Search (BFS) traversal
let bfs tree visit =
    let rec loop queue =
        match queue with
        | [] -> ()
        | Leaf :: rest -> loop rest
        | Node(value, children) :: rest ->
            visit value
            loop (rest @ children)
    loop [tree]

// Visualize tree with UTF-8 line symbols
let visualizeTree tree =
    let rec buildLines tree prefix isTail =
        match tree with
        | Leaf -> [sprintf "%s%s(Leaf)" prefix (if isTail then "└── " else "├── ")]
        | Node(value, children) ->
            let current = sprintf "%s%s%A" prefix (if isTail then "└── " else "├── ") value
            let childPrefix = prefix + (if isTail then "    " else "│   ")
            let childLines =
                children
                |> List.mapi (fun i child -> buildLines child childPrefix (i = List.length children - 1))
                |> List.concat
            current :: childLines
    buildLines tree "" true |> String.concat "\n"

// Generate a random tree
let randomTree depth maxChildren createValue =
    let rec generate depth =
        if depth = 0 then Leaf
        else
            let numChildren = System.Random().Next(maxChildren + 1)
            Node(createValue(), List.init numChildren (fun _ -> generate (depth - 1)))
    generate depth

// Demo: Perform random CRUD operations and time them
let demo () =
    let stopwatch = System.Diagnostics.Stopwatch.StartNew()

    // Create a random tree
    let tree = randomTree 5 3 (fun () -> System.Random().Next(0, 100))

    printfn "Initial Tree:\n%s" (visualizeTree tree)

    let mutable currentTree = tree
    for _ in 1 .. 100 do
        let operation = System.Random().NextDouble()
        let value = System.Random().Next(0, 100)

        currentTree <-
            if operation < 0.33 then insertValue currentTree value
            elif operation < 0.66 then deleteValue currentTree value
            else
                findValue currentTree value |> ignore
                currentTree

    printfn "Final Tree:\n%s" (visualizeTree currentTree)

    stopwatch.Stop()
    printfn "Random CRUD operations took %d ms" stopwatch.ElapsedMilliseconds

demo()

