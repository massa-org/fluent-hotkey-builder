# Fluent hotkey builder

Interface for typesafe hotkey creation with autocompletion


# Example

```ts
const hotkeys = context()
    .add((h) => h.alt.keyH.bind(() => console.log('hello world')))
    .add((h) => h.alt.f4.bind(() => console.log('goodbye')))
```