// src/sum.test.ts
import { assertType, test } from "vitest";
import { createHotkeyBuilder } from "../src/index";

function uncapitalize<T extends string>(v: T): Uncapitalize<T> {
    return (v[0].toLowerCase() + v.slice(1)) as never;
  }
  


test("sums two numbers", () => {
  const context = createHotkeyBuilder((["KeyA", "KeyB"] as const).map(uncapitalize));

  context().add((h) => h.keyB.bind(() => {}));
    
  // @ts-expect-error
  assertType(context().add((h) => h.keyC.bind(() => {})))
});
