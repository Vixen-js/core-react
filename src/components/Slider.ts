import {
  Orientation,
  QSlider,
  QSliderSignals,
  QWidget,
  TickPosition
} from "@vixen-js/core";
import { setViewProps, ViewProps } from "./View";
import { ComponentConfig, registerComponent, VWidget } from "./Config";
import { throwUnsupported } from "../utils/helpers";
import { AppContainer } from "../reconciler";
import { Fiber } from "react-reconciler";

export interface SliderProps extends ViewProps<QSliderSignals> {
  tickInterval?: number;
  tickPosition?: TickPosition;
  orientation?: Orientation;
  minimum?: number;
  maximum?: number;
  invertedAppearance?: boolean;
  invertedControls?: boolean;
  pageStep?: number;
  singleStep?: number;
  isSliderDown?: boolean;
  sliderPosition?: number;
  hasTracking?: boolean;
  value?: number;
}

const setSliderProps = (
  widget: VSlider,
  newProps: SliderProps,
  oldProps: SliderProps
) => {
  const setter: SliderProps = {
    set tickInterval(tickInterval: number) {
      widget.setTickInterval(tickInterval);
    },
    set tickPosition(tickPosition: TickPosition) {
      widget.setTickPosition(tickPosition);
    },
    set invertedAppearance(inverted: boolean) {
      widget.setInvertedAppearance(inverted);
    },
    set invertedControls(inverted: boolean) {
      widget.setInvertedControls(inverted);
    },
    set maximum(maximum: number) {
      widget.setMaximum(maximum);
    },
    set minimum(minimum: number) {
      widget.setMinimum(minimum);
    },
    set orientation(orientation: Orientation) {
      widget.setOrientation(orientation);
    },
    set pageStep(step: number) {
      widget.setPageStep(step);
    },
    set singleStep(step: number) {
      widget.setSingleStep(step);
    },
    set isSliderDown(down: boolean) {
      widget.setSliderDown(down);
    },
    set sliderPosition(position: number) {
      widget.setSliderPosition(position);
    },
    set hasTracking(enable: boolean) {
      widget.setTracking(enable);
    },
    set value(value: number) {
      widget.setValue(value);
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
};

export class VSlider extends QSlider implements VWidget {
  static tagName = "slider";
  setProps(newProps: SliderProps, oldProps: SliderProps): void {
    setSliderProps(this, newProps, oldProps);
  }

  appendInitialChild(_child: QWidget<any>): void {
    throwUnsupported(this);
  }

  appendChild(_child: QWidget<any>): void {
    throwUnsupported(this);
  }

  insertBefore(_child: QWidget<any>, _before: QWidget<any>): void {
    throwUnsupported(this);
  }

  removeChild(_child: QWidget<any>): void {
    throwUnsupported(this);
  }
}

class SliderConfig extends ComponentConfig {
  tagName = VSlider.tagName;

  shouldSetTextContent(_nextProps: SliderProps): boolean {
    return true;
  }

  createInstance(
    newProps: SliderProps,
    _rootInstance: AppContainer,
    _context: any,
    _workInProgress: Fiber
  ): VSlider {
    const widget = new VSlider();
    widget.setProps(newProps, {});
    return widget;
  }

  commitMount(
    instance: VSlider,
    newProps: SliderProps,
    _internalInstanceHandle: any
  ): void {
    if (newProps.visible !== false) {
      instance.show();
    }
    return;
  }

  commitUpdate(
    instance: VSlider,
    _updatePayload: any,
    oldProps: SliderProps,
    newProps: SliderProps
  ): void {
    instance.setProps(newProps, oldProps);
  }
}

export const Slider = registerComponent<SliderProps>(new SliderConfig());
