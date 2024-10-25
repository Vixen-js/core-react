export function throwUnsupported(instance: object) {
  throw new Error(
    `Unsupported operation performed in ${instance.constructor.name} `
  );
}

export function isValidUrl(str: string) {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

export function cleanEventListenerMap(
  widget: any,
  oldListenMap: any,
  listenMap: any
) {
  Object.entries(oldListenMap).forEach(([type, oldListener]) => {
    const newListener = listenMap[type];
    if (oldListener !== newListener) {
      widget.removeEventListener(type, oldListener);
    } else {
      delete listenMap[type];
    }
  });
}

export function addNewEventListeners(widget: any, listenMap: any) {
  Object.entries(listenMap).forEach(([type, newListener]) => {
    widget.addEventListener(type, newListener);
  });
}
