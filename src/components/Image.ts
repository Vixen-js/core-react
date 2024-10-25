import {
  AspectRatioMode,
  QLabel,
  QPixmap,
  QSize,
  QWidget,
  TransformationMode,
  WidgetEventTypes
} from "@vixen-js/core";
import { setTextProps, TextProps } from "./Text";
import { isValidUrl, throwUnsupported } from "../utils/helpers";
import {
  ComponentConfig,
  registerComponent,
  VComponent,
  VProps,
  VWidget
} from "./Config";
import { Fiber } from "react-reconciler";
import { AppContainer } from "../reconciler";

async function getImageResource(url: string) {
  const pixMap = new QPixmap();
  if (isValidUrl(url)) {
    const res = await fetch(url);
    const imageBuffer = Buffer.from(await res.arrayBuffer());
    pixMap.loadFromData(imageBuffer);
  } else {
    pixMap.load(url);
  }
  return pixMap;
}

export interface ImageProps extends TextProps {
  src?: string;
  aspectRatioMode?: AspectRatioMode;
  transmationMode?: TransformationMode;
  buffer?: Buffer;
}

const setImageProps = (
  widget: VImage,
  newProps: ImageProps,
  oldProps: ImageProps
) => {
  const setter: ImageProps = {
    set src(imgOrUrl: string) {
      if (!imgOrUrl) {
        return;
      }
      getImageResource(imgOrUrl)
        .then((pixmap) => {
          widget.setPixmap(pixmap);
        })
        .catch(console.warn);
    },
    set buffer(buffer: Buffer) {
      const pixMap = new QPixmap();
      pixMap.loadFromData(buffer);
      widget.setPixmap(pixMap);
    },
    set aspectRatioMode(mode: AspectRatioMode) {
      widget.setAspectRatioMode(mode);
    },
    set transmationMode(mode: TransformationMode) {
      widget.setTransformationMode(mode);
    }
  };
  Object.assign(setter, newProps);
  setTextProps(widget, newProps, oldProps);
};

export class VImage extends QLabel implements VWidget {
  static tagName = "image";
  setProps(newProps: VProps, oldProps: VProps): void {
    setImageProps(this, newProps, oldProps);
  }
  appendInitialChild(_child: QWidget<any>): void {
    throwUnsupported(this);
  }
  appendChild(_child: QWidget<any>): void {
    throwUnsupported(this);
  }
  insertBefore(_child: QWidget<any>, _beforeChild: QWidget<any>): void {
    throwUnsupported(this);
  }
  removeChild(_child: QWidget<any>): void {
    throwUnsupported(this);
  }

  originalPixmap?: QPixmap;
  aspectRatioMode?: AspectRatioMode;
  transmationMode?: TransformationMode;

  setPixmap(pixmap: QPixmap) {
    super.setPixmap(pixmap);
    this.originalPixmap = pixmap;
  }

  setAspectRatioMode(mode: AspectRatioMode) {
    this.aspectRatioMode = mode;
    this.scalePixmap(this.size());
  }

  setTransformationMode(mode: TransformationMode) {
    this.transmationMode = mode;
    this.scalePixmap(this.size());
  }

  scalePixmap(size: QSize) {
    if (this.originalPixmap) {
      return super.setPixmap(
        this.originalPixmap.scaled(
          size.width(),
          size.height(),
          this.aspectRatioMode,
          this.transmationMode
        )
      );
    }
  }
}

class ImageConfig extends ComponentConfig {
  tagName = VImage.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return true;
  }

  createInstance(
    props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const widget = new VImage();
    widget.setProperty("scaledContents", true);
    widget.setProps(props, {});
    widget.addEventListener(WidgetEventTypes.Resize, () => {
      widget.scalePixmap(widget.size());
    });
    return widget;
  }

  commitMount(
    _instance: VImage,
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

export const Image = registerComponent<ImageProps>(new ImageConfig());
