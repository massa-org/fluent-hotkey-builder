#! /usr/bin/env bun
import { createHotkeyBuilder } from "../src/index";
function uncapitalize<T extends string>(v: T): Uncapitalize<T> {
  return (v[0].toLowerCase() + v.slice(1)) as never;
}

const context = createHotkeyBuilder(
  (["KeyA", "KeyB"] as const).map(uncapitalize)
);

function handler(ctx: ReturnType<typeof context>) {
  const kmap: Record<string, typeof ctx.bindings[0]["bind"]> = {};

  for (const { keystroke, bind } of ctx.bindings) {
    for (const key of keystroke) {
      kmap[key] = bind;
    }
  }

  function handleKeyPress(key: "keyA" | "keyB") {
    kmap[key]?.();
  }
  return {
    handleKeyPress,
  };
}

const hnd = handler(
  context()
    .add((h) => h.keyA.bind(() => console.log("pressed key A")))
    .add((h) => h.keyB.bind(() => console.log("pressed key B")))
);

hnd.handleKeyPress("keyA");
hnd.handleKeyPress("keyB");
