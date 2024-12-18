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
  newProps: any
) {
  if (oldCallback === undefined) return;

  if (oldCallback !== newProps[type]) {
    widget.removeEventListener(type, oldCallback);
  } else {
    delete newProps[type];
  }
}

export function addNewEventListener<EventType>(
  widget: any,
  type: EventType,
  newCallback: any
) {
  if (newCallback !== undefined) {
    widget.addEventListener(type, newCallback);
  }
}
