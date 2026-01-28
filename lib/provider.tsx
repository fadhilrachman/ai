"use client";
import React from "react";
import type { AxiosError } from "axios";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  MutationCache,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Modal } from "antd";
import StyledComponentsRegistry from "./AntdRegistry";

function Provider({ children }: React.PropsWithChildren) {
  // const client = new QueryClient({

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
        // toast.error(`API Error: ${error message}`);
        console.log("==================queries==================");
        console.log(error);
        console.log("====================================");
      },
    }),
    mutationCache: new MutationCache({
      onError: (error: AxiosError<Record<string, unknown>>) => {
        // cache-level mutations error handler
        console.log("==============global mutation======================");
        console.log(error.response?.data);
        console.log("====================================");

        const responseData = error.response?.data ?? {};
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

        if (error.response?.status !== 401) {
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
                : "Error request"
            }`,
            okType: "danger",
          });
        }
      },
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default Provider;
