export interface DataWithOffset<T> {
  offset: number;
  widget: T;
}

type SetParentFunc<T> = (parent: T, index: number) => void;

type KeysOfType<T, TType> = {
  [Key in keyof T]-?: T[Key] extends TType | undefined ? Key : never;
}[keyof T];

type OnlyType<T, TType> = {
  [Key in KeysOfType<T, TType>]?: TType;
};

export const offsetOfIdx = <T>(
  idx: number,
  items: DataWithOffset<OnlyType<T, number>>[],
  sizeKey: keyof OnlyType<T, number>
) => {
  let offset = 0;
  if (idx > 0) {
    const prevChild = items[idx - 1];
    offset = prevChild.offset + (prevChild.widget[sizeKey] ?? 1);
  }

  return offset;
};

type Allowed<TItem, TParent> = OnlyType<TItem, SetParentFunc<TParent>>;

export function updateDisplacedChildren<TItem, TParent>(
  startIdx: number,
  items: DataWithOffset<OnlyType<TItem, number> & Allowed<TItem, TParent>>[],
  parent: TParent,
  sizeKey: keyof OnlyType<TItem, number>,
  setParentFuncKey: keyof Allowed<TItem, TParent>
) {
  let offset = offsetOfIdx(startIdx, items, sizeKey);
  for (let i = startIdx; i < items.length; i += 1) {
    const displacedChild = items[i];
    displacedChild.offset = offset;
    displacedChild.widget[setParentFuncKey]?.(parent, offset);

    offset += displacedChild.widget[sizeKey] ?? 1;
  }
}
