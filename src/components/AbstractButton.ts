import {
  QAbstractButton,
  QAbstractButtonSignals,
  QIcon,
  QSize
} from "@vixen-js/core";
import { ViewProps, setViewProps } from "./View";
import { addNewEventListener, cleanEventListener } from "../utils/helpers";

type ButtonSignals = ViewProps & Partial<QAbstractButtonSignals>;

/**
 * The Button component provides ability to add and manipulate native button widgets. It is based on
 * [Vixen UI VPushButton](https://vixen-js.github.io/docs/qpushbutton).
 * ## Example
 * ```typescript
 * import React from "react";
 * import { Renderer, Button, Window } from "@vixen-js/core-react";
 * const App = () => {
 *   return (
 *     <Window>
 *       <Button style={buttonStyle} text={"Hello World"} />
 *     </Window>
 *   );
 * };
 *
 * const buttonStyle = `
 *   color: white;
 * `;
 * Renderer.render(<App />);
 * ```
 */
export interface AbstractButtonProps extends ButtonSignals {
  /**
   * Alternative method of providing the button text
   */
  children?: string;
  /**
   * Sets the given text to the button. [QAbstractButton: setText](https://vixen-js.github.io/docs/qabstractbutton#text)
   */
  text?: string;
  /**
   * Sets an icon in the Button [QPushButton: setIcon](https://vixen-js.github.io/docs/qicon)
   */
  icon?: QIcon;
  /**
   * Set an icon size in the button. [QAbstractButton: setIconSize](https://vixen-js.github.io/docs/qabstractbutton#iconsize)
   */
  iconSize?: QSize;
}

export function setAbstractButtonProps(
  widget: QAbstractButton<QAbstractButtonSignals>,
  newProps: AbstractButtonProps,
  oldProps: AbstractButtonProps
) {
  const setter: AbstractButtonProps = {
    set children(childrenText: string) {
      widget.setText(childrenText);
    },
    set text(buttonText: string) {
      widget.setText(buttonText);
    },
    set icon(icon: QIcon) {
      widget.setIcon(icon);
    },
    set iconSize(iconSize: QSize) {
      widget.setIconSize(iconSize);
    },
    set onClick(callback: (checked: boolean) => void) {
      cleanEventListener<keyof QAbstractButtonSignals>(
        widget,
        "onClick",
        oldProps.onClick,
        callback
      );
      addNewEventListener<keyof QAbstractButtonSignals>(
        widget,
        "onClick",
        callback
      );
    },
    set onMousedown(callback: () => void) {
      cleanEventListener<keyof QAbstractButtonSignals>(
        widget,
        "onMousedown",
        oldProps.onMousedown,
        callback
      );
      addNewEventListener<keyof QAbstractButtonSignals>(
        widget,
        "onMousedown",
        callback
      );
    },
    set onMouseup(callback: () => void) {
      cleanEventListener<keyof QAbstractButtonSignals>(
        widget,
        "onMouseup",
        oldProps.onMouseup,
        callback
      );
      addNewEventListener<keyof QAbstractButtonSignals>(
        widget,
        "onMouseup",
        callback
      );
    },
    set onToggle(callback: (checked: boolean) => void) {
      cleanEventListener<keyof QAbstractButtonSignals>(
        widget,
        "onToggle",
        oldProps.onToggle,
        callback
      );
      addNewEventListener<keyof QAbstractButtonSignals>(
        widget,
        "onToggle",
        callback
      );
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
}
