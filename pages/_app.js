import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { magic } from "../lib/magic-client";
import Loading from "../componenets/loading/loading";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await magic.user.isLoggedIn();
        if (isLoggedIn) {
          if (router.pathname === "/login") {
            router.push("/"); // Redirect logged-in users from /login to /
          }
        } else {
          if (router.pathname !== "/login") {
            router.push("/login"); // Redirect non-logged-in users to /login
          }
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false); // Always executed
      }
    };

    checkLoginStatus();
  }, [router]);

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return isLoading ? <Loading /> : <Component {...pageProps} />;
}
