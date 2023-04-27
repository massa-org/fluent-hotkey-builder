// src/sum.test.ts
import { expect, suite, test } from "vitest";
import { createHotkeyBuilder } from "../src/index";

function uncapitalize<T extends string>(v: T): Uncapitalize<T> {
  return (v[0].toLowerCase() + v.slice(1)) as never;
}

function hello() {}

suite("context tests", () => {
  // also tests context separates
  const context = createHotkeyBuilder(
    (["KeyA", "KeyB", "Alt"] as const).map(uncapitalize)
  );

  test("single key keystroke", () => {
    const ctx = context().add((h) => h.keyB.bind(hello));

    expect(ctx.bindings[0].keystroke).toEqual(["keyB"]);
    expect(ctx.bindings[0].bind).toEqual(hello);
    expect(ctx.bindings.length).toBe(1);
  });

  test("multiple key keystroke", () => {
    const ctx = context().add((h) => h.keyB.keyA.bind(hello));

    expect(ctx.bindings[0].keystroke).toEqual(["keyB", "keyA"]);
    expect(ctx.bindings[0].bind).toEqual(hello);
    expect(ctx.bindings.length).toBe(1);
  });

  test("multiple bindings", () => {
    const ctx = context()
      .add((h) => h.keyB.bind(hello))
      .add((h) => h.keyA.bind(hello))
      .add((h) => h.alt.keyA.bind(hello));

    expect(ctx.bindings[0].keystroke).toEqual(["keyB"]);
    expect(ctx.bindings[0].bind).toEqual(hello);

    expect(ctx.bindings[1].keystroke).toEqual(["keyA"]);
    expect(ctx.bindings[1].bind).toEqual(hello);
    

    expect(ctx.bindings[2].keystroke).toEqual(["alt", "keyA"]);
    expect(ctx.bindings[2].bind).toEqual(hello);
    expect(ctx.bindings.length).toBe(3);
  });
});
