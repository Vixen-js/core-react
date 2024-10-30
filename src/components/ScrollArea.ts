import { QScrollArea, QScrollAreaSignals, QWidget } from "@vixen-js/core";
import { setViewProps, ViewProps } from "./View";
import { ComponentConfig, registerComponent, VWidget } from "./Config";
import { AppContainer } from "../reconciler";
import { Fiber } from "react-reconciler";

export interface ScrollAreaProps extends ViewProps<QScrollAreaSignals> {
  widgetResizable?: boolean;
}

const setScrollAreaProps = (
  widget: VScrollArea,
  newProps: ScrollAreaProps,
  oldProps: ScrollAreaProps
) => {
  const setter: ScrollAreaProps = {
    set widgetResizable(resizable: boolean) {
      widget.setWidgetResizable(resizable);
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
};

export class VScrollArea extends QScrollArea implements VWidget {
  static tagName = "scroll-area";
  setProps(newProps: ScrollAreaProps, oldProps: ScrollAreaProps): void {
    setScrollAreaProps(this, newProps, oldProps);
  }
  removeChild(child: QWidget<any>): void {
    const removedChild = this.takeWidget();
    if (removedChild) {
      removedChild.close();
    }
    child.close();
  }
  appendInitialChild(child: QWidget<any>): void {
    if (this.widget()) {
      console.warn("ScrollView can't have more than one child node");
      return;
    }
    this.setWidget(child);
  }
  appendChild(child: QWidget<any>): void {
    this.appendInitialChild(child);
  }
  insertBefore(child: QWidget<any>, _before: QWidget<any>): void {
    this.appendInitialChild(child);
  }
}

class ScrollAreaConfig extends ComponentConfig {
  tagName = VScrollArea.tagName;
  shouldSetTextContent(_newProps: ScrollAreaProps): boolean {
    return false;
  }
  createInstance(
    newProps: ScrollAreaProps,
    _rootInstance: AppContainer,
    _context: any,
    _workInProgress: Fiber
  ): VScrollArea {
    const widget = new VScrollArea();
    widget.setProps(newProps, {});
    return widget;
  }
  commitMount(
    instance: VScrollArea,
    newProps: ScrollAreaProps,
    _internalInstanceHandle: any
  ): void {
    if (newProps.visible !== false) {
      instance.show();
    }
    return;
  }
  commitUpdate(
    instance: VScrollArea,
    _updatePayload: any,
    oldProps: ScrollAreaProps,
    newProps: ScrollAreaProps
  ): void {
    instance.setProps(newProps, oldProps);
  }
}

export const ScrollArea = registerComponent<ScrollAreaProps>(
  new ScrollAreaConfig()
);
