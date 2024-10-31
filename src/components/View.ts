import {
  QWidget,
  WindowState,
  QCursor,
  QIcon,
  CursorShape,
  FlexLayout,
  QWidgetSignals,
  WidgetEventTypes,
  QLayout,
  QObjectSignals,
  QDialog
} from "@vixen-js/core";
import { NativeRawPointer } from "@vixen-js/core/dist/lib/core/Component";
import { VWidget, VProps, ComponentConfig, registerComponent } from "./Config";
import { addNewEventListeners, cleanEventListenerMap } from "../utils/helpers";
import { AppContainer } from "../reconciler";
import { Fiber } from "react-reconciler";

type Size = {
  width: number;
  height: number;
};

type VSize = Size & {
  fixed?: boolean;
};

type Position = {
  x: number;
  y: number;
};

type Geometry = Position & Size;

type WidgetAttributesMap = {
  [key: number]: boolean;
};

type WindowFlagsMap = {
  [key: number]: boolean;
};

export type WidgetEventListeners = {
  [key in WidgetEventTypes]: (event?: NativeRawPointer<"VEvent">) => void;
};
export interface ViewProps<Signals extends object> extends VProps {
  visible?: boolean;
  styleSheet?: string;
  style?: string;
  geometry?: Geometry;
  id?: string;
  mouseTracking?: boolean;
  enabled?: boolean;
  windowOpacity?: number;
  windowTitle?: string;
  windowState?: WindowState;
  cursor?: CursorShape | QCursor;
  windowIcon?: QIcon;
  minSize?: Size;
  maxSize?: Size;
  size?: VSize;
  pos?: Position;
  on?: Partial<WidgetEventListeners | Signals>;
  attributes?: WidgetAttributesMap;
  windowFlags?: WindowFlagsMap;
}

export function setViewProps<Signals extends object>(
  widget: QWidget<any>,
  newProps: ViewProps<Signals>,
  oldProps: ViewProps<Signals>
) {
  const setter: ViewProps<Signals> = {
    set visible(shouldShow: boolean) {
      if (shouldShow) {
        widget.show();
      } else {
        widget.hide();
      }
    },
    set styleSheet(styleSheet: string) {
      const styles =
        typeof styleSheet === "string" ? styleSheet : String(styleSheet);
      widget.setStyleSheet(styles);
    },
    set style(inlineStyle: string) {
      if (newProps.styleSheet) {
        console.warn("You can't use styleSheet and style together");
      }
      widget.setInlineStyle(inlineStyle);
    },
    set geometry(geometry: Geometry) {
      widget.setGeometry(
        geometry.x,
        geometry.y,
        geometry.width,
        geometry.height
      );
    },
    set id(id: string) {
      widget.setObjectName(id);
    },
    set mouseTracking(mouseTracking: boolean) {
      widget.setMouseTracking(mouseTracking);
    },
    set enabled(enabled: boolean) {
      widget.setEnabled(enabled);
    },
    set windowOpacity(windowOpacity: number) {
      widget.setWindowOpacity(windowOpacity);
    },
    set windowTitle(windowTitle: string) {
      widget.setWindowTitle(windowTitle);
    },
    set windowState(windowState: WindowState) {
      widget.setWindowState(windowState);
    },
    set cursor(cursor: CursorShape | QCursor) {
      widget.setCursor(cursor);
    },
    set windowIcon(windowIcon: QIcon) {
      widget.setWindowIcon(windowIcon);
    },
    set minSize(minSize: Size) {
      widget.setMinimumSize(minSize.width, minSize.height);
    },
    set maxSize(maxSize: Size) {
      widget.setMaximumSize(maxSize.width, maxSize.height);
    },
    set size(size: VSize) {
      if (size.fixed) {
        widget.setFixedSize(size.width, size.height);
      } else {
        const {
          minSize = { width: 0, height: 0 },
          maxSize = { width: 16777215, height: 16777215 }
        } = newProps;

        widget.setMinimumSize(minSize.width, minSize.height);
        widget.setMaximumSize(maxSize.width, maxSize.height);
        widget.resize(size.width, size.height);
      }
    },
    set pos(pos: Position) {
      widget.move(pos.x, pos.y);
    },
    set on(listenerMap: Partial<WidgetEventListeners | Signals>) {
      const listenMap: any = {
        ...listenerMap
      };
      const oldMap: any = {
        ...oldProps.on
      };

      // Clean previous listeners
      cleanEventListenerMap(widget, oldMap, listenMap);

      // Add new listeners
      addNewEventListeners(widget, listenMap);
    },
    set attributes(attributes: WidgetAttributesMap) {
      Object.entries(attributes).forEach(([key, value]) => {
        widget.setAttribute(+key, value);
      });
    },
    set windowFlags(windowFlags: WindowFlagsMap) {
      Object.entries(windowFlags).forEach(([key, value]) => {
        widget.setWindowFlag(+key, value);
      });
    }
  };

  Object.assign(setter, newProps);
}

export class VView extends QWidget implements VWidget {
  static tagName = "view";

  private _layout: QLayout<QObjectSignals> | null = null;

  layout() {
    return this._layout;
  }

  setLayout(layout: QLayout<QObjectSignals>) {
    this._layout = layout;
    super.setLayout(layout);
  }

  setProps(
    newProps: ViewProps<QWidgetSignals>,
    oldProps: ViewProps<QWidgetSignals>
  ): void {
    setViewProps(this, newProps, oldProps);
  }

  insertBefore(child: QWidget<any>, beforeChild: QWidget<any>): void {
    if (!this.layout() || child instanceof QDialog) {
      if (!this.layout()) {
        console.warn("parent doesn't have layout");
        return;
      }
    }
    (this.layout() as FlexLayout).insertChildBefore(child, beforeChild);
  }
  appendInitialChild(child: QWidget<any>): void {
    this.appendChild(child);
  }

  appendChild(child: QWidget<any>): void {
    if (!child || child instanceof QDialog) {
      return;
    }
    if (!this.layout()) {
      const flex = new FlexLayout();
      flex.setFlexNode(this.getFlexNode());
      this.setLayout(flex);
    }

    this.layout()!.addWidget(child);
  }

  removeChild(child: QWidget<any>): void {
    if (!this.layout()) {
      console.warn("parent doesn't have layout to remove child");
      return;
    }
    this.layout()!.removeWidget(child);
    child.close();
  }
}

class ViewConfig extends ComponentConfig {
  tagName = VView.tagName;
  shouldSetTextContent() {
    return false;
  }
  createInstance(
    newProps: ViewProps<QWidgetSignals>,
    _root: AppContainer,
    _context: any,
    _workInProgress: Fiber
  ): VView {
    const widget = new VView();
    widget.setProps(newProps, {});
    return widget;
  }
  commitMount(
    instance: VView,
    newProps: ViewProps<QWidgetSignals>,
    _internalInstanceHandle: any
  ): void {
    if (newProps.visible !== false) {
      instance.show();
    }
    return;
  }
  commitUpdate(
    instance: VView,
    _updatePayload: any,
    oldProps: ViewProps<QWidgetSignals>,
    newProps: ViewProps<QWidgetSignals>
  ): void {
    instance.setProps(newProps, oldProps);
  }
}

export const View = registerComponent<ViewProps<QWidgetSignals>>(
  new ViewConfig()
);
