"use client";
import React from "react";
import axios from "axios";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  MutationCache,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { modal as Modal } from "./antd-static";
import StyledComponentsRegistry from "./AntdRegistry";
import { GoogleOAuthProvider } from "@react-oauth/google";

function Provider({ children }: React.PropsWithChildren) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1, // maksimal retry 2 kali untuk queries
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // exponential backoff
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        // cache-level queries error handler
        console.log("==================queries==================");
        console.log(error);
        console.log("====================================");
      },
    }),
    mutationCache: new MutationCache({
      onError: (error: Error) => {
        // cache-level mutations error handler
        console.log("==============global mutation======================");
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        }
        console.log("====================================");

        const responseData = axios.isAxiosError(error) ? error.response?.data ?? {} : {};
        const responseValues = Object.values(responseData);
        const exceptionForModal = responseValues.some((val) =>
          Array.isArray(val)
            ? val.includes(`you don't have any bulk create processing`)
            : typeof val === "string" &&
              val.includes(`you don't have any bulk create processing`),
        );

        if (exceptionForModal) {
          return;
        }

        if (axios.isAxiosError(error) && error.response?.status !== 401) {
          Modal.error({
            title: "Error",
            onOk: () => {},
            content: `${
              error.response !== undefined
                ? responseValues
                    .map((val) =>
                      Array.isArray(val) ? val.join(", ") : String(val),
                    )
                    .join(" | ")
                : error.message || "Error request"
            }`,
            okType: "danger",
          });
        }
      },
    }),
  });

  // Replace 'YOUR_GOOGLE_CLIENT_ID' with your actual Google Client ID
  // You can set this in an environment variable: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default Provider;
