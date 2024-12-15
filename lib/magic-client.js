import { Magic } from "magic-sdk";

export const createMagic = () => {
  if (typeof window !== "undefined") {
    const magicInstance = new Magic(
      process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY
    );
    return magicInstance;
  }
};

export const magic = createMagic();
