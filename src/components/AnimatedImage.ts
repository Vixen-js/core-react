import { QLabel, QMovie, QSize, QWidget } from "@vixen-js/core";
import { TextProps } from "./Text";
import { isValidUrl, throwUnsupported } from "../utils/helpers";
import {
  ComponentConfig,
  registerComponent,
  VComponent,
  VProps,
  VWidget
} from "./Config";
import { setViewProps } from "./View";
import { Fiber } from "react-reconciler";
import { AppContainer } from "../reconciler";

async function getMovieResource(url: string) {
  const movie = new QMovie();
  if (isValidUrl(url)) {
    const res = await fetch(url);
    const imageBuffer = Buffer.from(await res.arrayBuffer());
    movie.loadFromData(imageBuffer);
  } else {
    movie.setFileName(url);
  }
  return movie;
}

export interface AnimatedImageProps extends TextProps {
  src?: string;
  buffer?: Buffer;
}

const setAnimatedImageProps = (
  widget: VAnimatedImage,
  newProps: AnimatedImageProps,
  oldProps: AnimatedImageProps
) => {
  const setter: AnimatedImageProps = {
    set src(imgOrUrl: string) {
      if (!imgOrUrl) {
        return;
      }
      getMovieResource(imgOrUrl)
        .then((movie) => {
          widget.setMovie(movie);
          widget.movie()?.start();
        })
        .catch(console.warn);
    },
    set buffer(buffer: Buffer) {
      const movie = new QMovie();
      movie.loadFromData(buffer);
      widget.setMovie(movie);
      widget.movie()?.start();
    }
  };
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
};

export class VAnimatedImage extends QLabel implements VWidget {
  setProps(newProps: VProps, oldProps: VProps): void {
    setAnimatedImageProps(this, newProps, oldProps);
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
  static tagName: string = "animated-image";
  scaleMovie(size: QSize) {
    const movie = this.movie();
    movie?.setScaledSize(size);
  }
}

class AnimatedImageConfig extends ComponentConfig {
  tagName = VAnimatedImage.tagName;
  shouldSetTextContent(_nextProps: VProps): boolean {
    return true;
  }
  createInstance(
    props: VProps,
    _root: AppContainer,
    _context?: any,
    _worInProgress?: Fiber
  ): VComponent {
    const animatedImage = new VAnimatedImage();
    animatedImage.setProperty("scaledContents", true);
    animatedImage.setProps(props, {});
    return animatedImage;
  }
  commitMount(
    _instance: VAnimatedImage,
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

export const AnimatedImage = registerComponent<AnimatedImageProps>(
  new AnimatedImageConfig()
);
