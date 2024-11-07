import {
  QBoxLayoutSignals,
  Direction,
  QWidget,
  QBoxLayout,
  QLayout,
  QDialog
} from "@vixen-js/core";
import { setViewProps, ViewProps } from "./View";
import {
  ComponentConfig,
  registerComponent,
  VComponent,
  VProps
} from "./Config";
import { Fiber } from "react-reconciler";
import { AppContainer, Ctx } from "../reconciler";

type BoxViewSignals = ViewProps & Partial<QBoxLayoutSignals>;

export interface BoxViewProps extends BoxViewSignals {
  direction?: Direction;
}

const setBoxViewProps = (
  widget: VBoxView,
  newProps: BoxViewProps,
  oldProps: BoxViewProps
) => {
  const setter: BoxViewProps = {
    set direction(direction: Direction) {
      widget.layout()?.setDirection(direction);
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
};

export class VBoxView extends QWidget implements VComponent {
  initialProps?: BoxViewProps;
  _children: Array<QWidget<any>> = [];
  static tagName = "box-view";

  layout(): QBoxLayout | null {
    return super.layout() as any;
  }

  setLayout(layout: QLayout): void {
    super.setLayout(layout);
  }

  setProps(newProps: VProps, oldProps: VProps): void {
    if (this.layout()) {
      setBoxViewProps(this, newProps, oldProps);
    } else {
      this.initialProps = newProps;
    }
  }

  appendInitialChild(child: QWidget) {
    this.appendInitialChild(child);
  }

  appendChild(child: QWidget) {
    if (child instanceof QDialog) {
      return;
    }

    const updateChild = () => {
      this.layout()?.addWidget(child);
      this._children.push(child);
    };
    if (this.layout()) {
      updateChild();
      return;
    }

    const layout = new QBoxLayout(Direction.LeftToRight);
    this.setLayout(layout);

    // Set Initial Props
    if (this.initialProps) {
      setBoxViewProps(this, this.initialProps, {});
    }

    updateChild();
  }

  insertBefore(child: QWidget<any>, before: QWidget<any>): void {
    if (child instanceof QDialog) {
      return;
    }

    const previousIdx = this._children.indexOf(before);

    if (previousIdx === -1) {
      throw new Error("Attempted to insert child before non-existent child");
    }

    this._children.splice(previousIdx, 0, child);
    this.layout()?.insertWidget(previousIdx, child);
  }

  removeChild(child: QWidget) {
    const previousIdx = this._children.indexOf(child);

    if (previousIdx === -1) {
      this._children.splice(previousIdx, 1);
    }

    child.close();
  }
}

class BoxViewConfig extends ComponentConfig {
  tagName = VBoxView.tagName;

  shouldSetTextContent(_nextProps: VProps): boolean {
    return false;
  }
  createInstance(
    props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const widget = new VBoxView();
    widget.setProps(props, {});
    return widget;
  }
  finalizeInitialChildren(
    _instance: VComponent,
    _newProps: VProps,
    _root: AppContainer,
    _ctx: Ctx
  ): boolean {
    return true;
  }
  commitMount(
    _instance: VBoxView,
    _newProps: VProps,
    _internalInstanceHandle: any
  ): void {
    if (_newProps.visible !== false) {
      _instance.show();
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

export const BoxView = registerComponent<BoxViewProps>(new BoxViewConfig());
