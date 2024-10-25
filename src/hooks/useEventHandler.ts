import { DependencyList, useMemo } from "react";
import { WidgetEventListeners } from "../components/View";

export function useEventHandler<Signals>(
  eventMap: Partial<WidgetEventListeners | Signals>,
  deps: DependencyList
) {
  const handler = useMemo(() => {
    return eventMap;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return handler;
}
