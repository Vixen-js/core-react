import "./types";
import createProxy, { type ReactProxyComponent } from "react-proxy";

export let appProxy: ReactProxyComponent;

export function hot(Component: React.ComponentType): React.ComponentType {
  if (appProxy) {
    appProxy.update(Component);
  } else {
    appProxy = createProxy(Component);
  }

  return appProxy.get();
}
