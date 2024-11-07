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

export function cleanEventListener<EventType>(
  widget: any,
  type: EventType,
  oldCallback: any,
  newCallback: any
) {
  if (oldCallback !== newCallback) {
    widget.removeEventListener(type, oldCallback);
  } else {
    delete newCallback[type];
  }
}

export function addNewEventListener<EventType>(
  widget: any,
  type: EventType,
  newCallback: any
) {
  widget.addEventListener(type, newCallback);
}
