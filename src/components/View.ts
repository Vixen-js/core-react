import {
  QWidget,
  WindowState,
  QCursor,
  QIcon,
  CursorShape,
  FlexLayout,
  WidgetEventTypes,
  QLayout,
  QObjectSignals,
  QDialog
} from "@vixen-js/core";
import { NativeRawPointer } from "@vixen-js/core/dist/lib/core/Component";
import { VWidget, VProps, ComponentConfig, registerComponent } from "./Config";
import { addNewEventListener, cleanEventListener } from "../utils/helpers";
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

export type EventCallback = (event?: NativeRawPointer<"VEvent">) => void;
export type WidgetEventListeners = {
  [key in WidgetEventTypes]: EventCallback;
};

export type EventTypesUnion = `${WidgetEventTypes}`;

export interface ViewProps extends VProps, Partial<WidgetEventListeners> {
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
  attributes?: WidgetAttributesMap;
  windowFlags?: WindowFlagsMap;
}

export function setViewProps(
  widget: QWidget<any>,
  newProps: ViewProps,
  oldProps: ViewProps
) {
  const setter: ViewProps = {
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

  // Event Listener Definition
  Object.keys(WidgetEventTypes)
    .filter((type) => type !== "None")
    .forEach((eventType) => {
      const evtType = eventType as Omit<EventTypesUnion, "None">;
      cleanEventListener<typeof evtType>(
        widget,
        evtType,
        oldProps[evtType.toString()],
        newProps
      );
      addNewEventListener<typeof evtType>(
        widget,
        eventType,
        newProps[evtType.toString()]
      );
    });

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

  setProps(newProps: ViewProps, oldProps: ViewProps): void {
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
    newProps: ViewProps,
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
    newProps: ViewProps,
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
    oldProps: ViewProps,
    newProps: ViewProps
  ): void {
    instance.setProps(newProps, oldProps);
  }
}

export const View = registerComponent<ViewProps>(new ViewConfig());
