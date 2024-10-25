import { EchoMode, QLineEdit, QLineEditSignals, QWidget } from "@vixen-js/core";
import { setViewProps, ViewProps } from "./View";
import {
  ComponentConfig,
  registerComponent,
  VComponent,
  VProps,
  VWidget
} from "./Config";
import { throwUnsupported } from "../utils/helpers";
import { Fiber } from "react-reconciler";
import { AppContainer } from "../reconciler";

/**
 * The LineEdit component provides ability to add and manipulate native editable text field widgets. It is based on
 * ## Example
 * ```javascript
 * import React from "react";
 * import { Renderer, LineEdit, Window } from "@vixen-js/core-react";
 * const App = () => {
 *   const handleTextChanged = textValue => {
 *    console.log(textValue);
 *   };
 *   return (
 *     <Window>
 *      <LineEdit on={{ textChanged: handleTextChanged }} />
 *    </Window>
 *   );
 * };
 * Renderer.render(<App />);
 * ```
 */
export interface LineEditProps extends ViewProps<QLineEditSignals> {
  text?: string;
  placeholderText?: string;
  readOnly?: boolean;
  echoMode?: EchoMode;
}

const setLineEditProps = (
  widget: VLineEdit,
  newProps: LineEditProps,
  oldProps: LineEditProps
) => {
  const setter: LineEditProps = {
    set text(text: string) {
      widget.setText(text);
    },
    set placeholderText(text: string) {
      widget.setPlaceholderText(text);
    },
    set readOnly(readOnly: boolean) {
      widget.setReadOnly(readOnly);
    },
    set echoMode(echoMode: EchoMode) {
      widget.setEchoMode(echoMode);
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
};

export class VLineEdit extends QLineEdit implements VWidget {
  static tagName = "line-edit";
  setProps(newProps: LineEditProps, oldProps: LineEditProps) {
    setLineEditProps(this, newProps, oldProps);
  }

  appendChild(_child: QWidget<any>): void {
    throwUnsupported(this);
  }
  appendInitialChild(_child: QWidget<any>): void {
    this.appendChild(this);
  }
  insertBefore(_child: QWidget<any>, _beforeChild: QWidget<any>): void {
    throwUnsupported(this);
  }
  removeChild(_child: QWidget<any>): void {
    throwUnsupported(this);
  }
}

class LineEditConfig extends ComponentConfig {
  tagName = VLineEdit.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return true;
  }
  createInstance(
    props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const widget = new VLineEdit();
    widget.setProps(props, {});
    return widget;
  }
  commitMount(
    instance: VLineEdit,
    newProps: VProps,
    _internalInstanceHandle: any
  ): void {
    if (newProps.visible !== false) {
      instance.show();
    }
  }
  commitUpdate(
    instance: VComponent,
    _updatePayload: any,
    oldProps: VProps,
    newProps: VProps,
    _root: AppContainer
  ): void {
    instance.setProps(newProps, oldProps);
  }
}

export const LineEdit = registerComponent<LineEditProps>(new LineEditConfig());
