import rec, { appContainer } from "./reconciler";
import ReactReconciler, { RootTag } from "react-reconciler";
import React from "react";

// @ts-ignore
import deepForceUpdate from "react-deep-force-update";

type VixenReconciler = typeof rec;

export type RendererOpts = {
  onRender?: () => void;
  onInit?: (reconciler: VixenReconciler) => void;
};

const defaultOpts: RendererOpts = {
  onInit() {},
  onRender() {}
};

export class Renderer {
  static container?: ReactReconciler.FiberRoot;
  static forceUpdate() {
    if (Renderer.container) {
      Renderer.container._reactInternalInstance = Renderer.container.current;
      deepForceUpdate(Renderer.container);
    }
  }

  static render(element: React.ReactNode, opts?: RendererOpts) {
    const containerInfo = appContainer;
    const isConcurrent = true;
    const hydrate = false;

    const renderOpts = { ...defaultOpts, ...opts };
    const rootTag: RootTag = 0;

    Renderer.container = rec.createContainer(
      containerInfo,
      rootTag,
      null,
      isConcurrent,
      hydrate,
      "",
      (_err) => {},
      null
    );

    if (renderOpts.onInit) {
      renderOpts.onInit(rec);
    }

    const parent = null;

    rec.updateContainer(element, Renderer.container, parent, () => {
      if (renderOpts.onRender) {
        renderOpts.onRender();
      }
    });
  }
}

global.__REACT__ = React;
