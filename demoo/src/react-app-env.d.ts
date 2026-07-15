/// <reference types="vite/client" />

// Side-effect CSS imports (demoo's own and the design-system source pulled in
// via the workspace path mappings).
declare module "*.css" {}

declare module "*.svg" {
  import * as React from "react";
  const ReactComponent: React.FunctionComponent<
    React.ComponentProps<"svg"> & { title?: string }
  >;
  export default ReactComponent;
}
