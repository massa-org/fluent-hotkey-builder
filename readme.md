# Fluent hotkey builder

Builder for generate typesafe hotkey context that allow to bind keystroke to action

Implement as builder to allow generate hotkey context for platforms with different keycodes
- web browsers
- system wide keybindings for node/bun

Hotkey context split from keyPressHandler implementation cause it allow to implement keyPressHandler for multiple different scopes

#### Examples in svelte
ex. bind hotkeys to focused html element
```jsx
<input use:handleHotkey={context().add((h) => h.enter.bind(search))} />
```

ex. bind to interactive element
```jsx
<button use:hotkey={(h) => h.enter}>Search</button>
```

```jsx
<input use:hotkey={(h) => h.control.keyK}>Search box</input>
```


# Example

```ts
const hotkeys = context()
    .add((h) => h.alt.keyH.bind(() => console.log('hello world')))
    .add((h) => h.alt.f4.bind(() => console.log('goodbye')))
```

