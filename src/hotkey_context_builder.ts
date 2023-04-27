type HotkeyKeystroke<AK> = AK[];
// TODO accept binding into builder type parameters
// @ts-ignore
type Binding<AK> = () => void;
type HotkeyBinding<AK> = { keystroke: HotkeyKeystroke<AK>; bind: Binding<AK> };

export type HotkeyFluentBuilder<AK extends string> = {
  readonly [K in AK]: HotkeyFluentBuilder<AK>;
} & {
  bind(fn: Binding<AK>): HotkeyBinding<AK>;
  keys: HotkeyKeystroke<AK>;
};

export interface HotkeyContext<AK extends string> {
  bindings: HotkeyBinding<AK>[];
  add(
    init: (h: HotkeyFluentBuilder<AK>) => HotkeyBinding<AK>
  ): HotkeyContext<AK>;
}

export function createHotkeyBuilder<AK extends ReadonlyArray<string>>(
  allowedKeys: AK
) {
  const _allowedKeys = allowedKeys;
  type _allowedKeys = AK[number];

  function buildProto() {
    const proto = {
      bind(
        this: HotkeyFluentBuilder<_allowedKeys>,
        fn: () => void
      ): HotkeyBinding<_allowedKeys> {
        return { keystroke: this.keys, bind: fn };
      },
    };
    for (const k of _allowedKeys) {
      Object.defineProperty(proto, k, {
        get: function (this) {
          return hotkeyFluentBuilder([...this.keys, k]);
        },
      });
    }
    return proto;
  }

  const hotkeyFluentBuilderPrototype = buildProto();

  function hotkeyFluentBuilder(
    keys: string[] = []
  ): HotkeyFluentBuilder<_allowedKeys> {
    return Object.setPrototypeOf({ keys }, hotkeyFluentBuilderPrototype);
  }

  function hotkeyContext(
    bindings: HotkeyBinding<_allowedKeys>[] = []
  ): HotkeyContext<_allowedKeys> {
    const proto = {
      add(
        this: HotkeyContext<_allowedKeys>,
        init: (
          h: HotkeyFluentBuilder<_allowedKeys>
        ) => HotkeyBinding<_allowedKeys>
      ) {
        return hotkeyContext([...this.bindings, init(hotkeyFluentBuilder())]);
      },
    };

    return Object.setPrototypeOf({ bindings }, proto);
  }

  return hotkeyContext;
}
