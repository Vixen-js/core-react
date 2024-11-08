import {
  DayOfWeek,
  QCalendarWidgetSignals,
  QDate,
  QFont,
  QWidget
} from "@vixen-js/core";
import { setViewProps, ViewProps } from "./View";
import {
  HorizontalHeaderFormat,
  QCalendarWidget,
  VerticalHeaderFormat,
  SelectionMode
} from "@vixen-js/core/dist/lib/QtWidgets/QCalendarWidget";
import {
  ComponentConfig,
  registerComponent,
  VComponent,
  VProps
} from "./Config";
import {
  addNewEventListener,
  cleanEventListener,
  throwUnsupported
} from "../utils/helpers";
import { Fiber } from "react-reconciler";
import { AppContainer } from "../reconciler";

type CalendarSignals = ViewProps & Partial<QCalendarWidgetSignals>;
export interface CalendarProps extends CalendarSignals {
  dateEditAcceptDelay?: number;
  dateEditEnabled?: boolean;
  gridVisible?: boolean;
  navigationBarVisible?: boolean;

  firstDayOfWeek?: DayOfWeek;
  font?: QFont;

  horizontalheaderformat?: HorizontalHeaderFormat;
  vericalHeaderFormat?: VerticalHeaderFormat;

  selectionMode?: SelectionMode;
}

const setCalendarProps = (
  widget: VCalendar,
  newProps: CalendarProps,
  oldProps: CalendarProps
) => {
  const setter: CalendarProps = {
    set dateEditAcceptDelay(dateEditAcceptDelay: number) {
      widget.setDateEditAcceptDelay(dateEditAcceptDelay);
    },
    set dateEditEnabled(dateEditEnabled: boolean) {
      widget.setDateEditEnabled(dateEditEnabled);
    },
    set gridVisible(gridVisible: boolean) {
      widget.setGridVisible(gridVisible);
    },
    set navigationBarVisible(navigationBarVisible: boolean) {
      widget.setNavigationBarVisible(navigationBarVisible);
    },
    set firstDayOfWeek(firstDayOfWeek: DayOfWeek) {
      widget.setFirstDayOfWeek(firstDayOfWeek);
    },
    set font(font: QFont) {
      widget.setFont(font);
    },
    set horizontalheaderformat(horizontalHeaderFormat: HorizontalHeaderFormat) {
      widget.setHorizontalHeaderFormat(horizontalHeaderFormat);
    },
    set vericalHeaderFormat(verticalHeaderFormat: VerticalHeaderFormat) {
      widget.setVerticalHeaderFormat(verticalHeaderFormat);
    },
    set selectionMode(mode: SelectionMode) {
      widget.setSelectionMode(mode);
    },
    set onActivate(callback: (date: QDate) => void) {
      cleanEventListener<keyof QCalendarWidgetSignals>(
        widget,
        "onActivate",
        oldProps.onActivate,
        newProps
      );
      addNewEventListener<keyof QCalendarWidgetSignals>(
        widget,
        "onActivate",
        callback
      );
    },
    set onClick(callback: (date: QDate) => void) {
      cleanEventListener<keyof QCalendarWidgetSignals>(
        widget,
        "onClick",
        oldProps.onClick,
        newProps
      );
      addNewEventListener<keyof QCalendarWidgetSignals>(
        widget,
        "onClick",
        callback
      );
    },
    set onCurrentPageChange(callback: (year: number, month: number) => void) {
      cleanEventListener<keyof QCalendarWidgetSignals>(
        widget,
        "onCurrentPageChange",
        oldProps.onCurrentPageChange,
        newProps
      );
      addNewEventListener<keyof QCalendarWidgetSignals>(
        widget,
        "onCurrentPageChange",
        callback
      );
    },
    set onSelectionChange(callback: () => void) {
      cleanEventListener<keyof QCalendarWidgetSignals>(
        widget,
        "onSelectionChange",
        oldProps.onSelectionChange,
        newProps
      );
      addNewEventListener<keyof QCalendarWidgetSignals>(
        widget,
        "onSelectionChange",
        callback
      );
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
};

export class VCalendar extends QCalendarWidget implements VComponent {
  static tagName = "calendar";
  setProps(newProps: CalendarProps, oldProps: CalendarProps): void {
    setCalendarProps(this, newProps, oldProps);
  }
  appendInitialChild(_child: QWidget) {
    throwUnsupported(this);
  }
  appendChild(_child: QWidget) {
    throwUnsupported(this);
  }
  insertBefore(_child: QWidget, _before: QWidget) {
    throwUnsupported(this);
  }
  removeChild(_child: QWidget) {
    throwUnsupported(this);
  }
}

class CalendarConfig extends ComponentConfig {
  tagName = VCalendar.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return false;
  }
  createInstance(
    props: CalendarProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const widget = new VCalendar();
    widget.setProps(props, {});
    return widget;
  }
  commitMount(
    _instance: VCalendar,
    _newProps: CalendarProps,
    _internalInstanceHandle: any
  ): void {
    if (_newProps.visible) {
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

export const Calendar = registerComponent<CalendarProps>(new CalendarConfig());
