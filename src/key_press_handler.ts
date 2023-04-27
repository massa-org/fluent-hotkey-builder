import { HotkeyContext } from "./hotkey_context_builder";

// reference implementation of keyPressHandler
// manage bindings execution
// - case insensetive
// - trigers only on last key in keystroke
// - multiple keycodes for key through `keyDownM`, `keyUpM`
export function createKeyPressHandler<AK extends string>(
  context: HotkeyContext<AK>
) {
  const bindings = context.bindings.map((v) => ({
    bind: v.bind,
    keystroke: v.keystroke.map((v) => v.toLowerCase()),
  }));

  const keycounter = {} as Record<string, number>;
  const triggers = {} as Record<string, (typeof bindings)[0]>;

  function down(key: string) {
    keycounter[key] = (keycounter[key] ?? 0) + 1;
  }
  function up(key: string) {
    keycounter[key] -= 1;
  }
  function isPressed(key: string) {
    return keycounter[key] > 0;
  }

  for (const binding of bindings) {
    if (binding.keystroke.length == 0) continue;
    triggers[binding.keystroke[binding.keystroke.length - 1]] = binding;
  }

  return {
    // uses if key can be represented by multiple keycodes
    // such keypress event in browser has `event.key` and `event.code`
    // it allows to mix modifiers into keypresses such code is AltL | ALtR where key is Alt
    keyDownM(keyCodes: string[]) {
      keyCodes = keyCodes.map((v) => v.toLowerCase());
      keyCodes.forEach(down);

      const trigger = keyCodes.map((key) => triggers[key]).filter(Boolean)[0];
      if (!trigger) return;
      if (!trigger.keystroke.every(isPressed)) return;

      trigger.bind();
    },
    keyUpM(keyCodes: string[]) {
      keyCodes.map((v) => v.toLowerCase()).forEach(up);
    },

    keyDown(key: string) {
      key = key.toLowerCase();
      down(key);

      const trigger = triggers[key];
      if (!trigger) return;
      if (!trigger.keystroke.every(isPressed)) return;

      trigger.bind();
    },
    keyUp(key: string) {
      up(key);
    },
  };
}
