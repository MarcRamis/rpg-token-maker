import type { BuiltInToken } from "../types/token";

const tokenModules = import.meta.glob(
  "../assets/tokens/*.{png,jpg,jpeg,webp,svg}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

export const BUILT_IN_TOKENS: BuiltInToken[] =
  Object.entries(tokenModules).map(([path, src]) => {
    const fileName =
      path.split("/").pop()?.split(".")[0] ?? "Token";

    return {
      name: fileName,
      src: src as string,
    };
  });