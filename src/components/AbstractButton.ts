import {
  QAbstractButton,
  QAbstractButtonSignals,
  QIcon,
  QSize
} from "@vixen-js/core";
import { ViewProps, setViewProps } from "./View";

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
export interface AbstractButtonProps<Signals extends QAbstractButtonSignals>
  extends ViewProps<Signals> {
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

export function setAbstractButtonProps<Signals extends QAbstractButtonSignals>(
  widget: QAbstractButton<Signals>,
  newProps: AbstractButtonProps<Signals>,
  oldProps: AbstractButtonProps<Signals>
) {
  const setter: AbstractButtonProps<Signals> = {
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
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
}
