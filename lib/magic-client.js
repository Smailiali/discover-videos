import { Magic } from "magic-sdk";

export const createMagic = () => {
  if (typeof window !== "undefined") {
    const magicInstance = new Magic(
      process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY
    );
    console.log("Magic SDK initialized:", magicInstance); // Log to ensure it's initialized
    return magicInstance;
  }
};

export const magic = createMagic();

console.log("magic setup", magic); // Log to check if magic is properly set up
