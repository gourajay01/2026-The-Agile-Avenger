// utils/hooks/useMarketplaceClient.ts
"use client";
import { ClientSDK } from "@sitecore-marketplace-sdk/client";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { XMC } from "@sitecore-marketplace-sdk/xmc";

export interface MarketplaceClientState {
    client: ClientSDK | null;
    error: Error | null;
    isLoading: boolean;
    isInitialized: boolean;
}

export interface UseMarketplaceClientOptions {
    retryAttempts?: number; // Default: 3
    retryDelay?: number; // Default: 1000ms
    autoInit?: boolean; // Default: true
}

const DEFAULT_OPTIONS: Required<UseMarketplaceClientOptions> = {
    retryAttempts: 3,
    retryDelay: 1000,
    autoInit: true,
};

let client: ClientSDK | undefined = undefined;

async function getMarketplaceClient() {
    if (client) {
        return client;
    }
    const config = {
        target: window.parent,
        modules: [XMC],

    };
    client = await ClientSDK.init(config);
    return client;
}

export function useMarketplaceClient(options: UseMarketplaceClientOptions = {}) {
    const opts = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options]);

    const [state, setState] = useState<MarketplaceClientState>({
        client: null,
        error: null,
        isLoading: false,
        isInitialized: false,
    });

    const isInitializingRef = useRef(false);

    const initializeClient = useCallback(async (attempt = 1): Promise<void> => {
        let shouldProceed = false;
        setState(prev => {
            if (prev.isLoading || prev.isInitialized || isInitializingRef.current) {
                return prev;
            }
            shouldProceed = true;
            isInitializingRef.current = true;
            return { ...prev, isLoading: true, error: null };
        });

        if (!shouldProceed) return;

        try {
            const client = await getMarketplaceClient();
            setState({
                client,
                error: null,
                isLoading: false,
                isInitialized: true,
            });
            console.log("Marketplace SDK State: ", state);
        } catch (error) {
            if (attempt < opts.retryAttempts) {
                await new Promise(resolve => setTimeout(resolve, opts.retryDelay));
                return initializeClient(attempt + 1);
            }
            setState({
                client: null,
                error: error instanceof Error ? error : new Error('Failed to initialize MarketplaceClient'),
                isLoading: false,
                isInitialized: false,
            });
        } finally {
            isInitializingRef.current = false;
        }
    }, [opts.retryAttempts, opts.retryDelay]);

    useEffect(() => {
        if (opts.autoInit) {
            initializeClient();
        }
        return () => {
            isInitializingRef.current = false;
            setState({
                client: null,
                error: null,
                isLoading: false,
                isInitialized: false,
            });
        };
    }, [opts.autoInit, initializeClient]);

    return useMemo(() => ({
        ...state,
        initialize: initializeClient,
    }), [state, initializeClient]);
}

// import { ClientSDK } from "@sitecore-marketplace-sdk/client";
// import { useEffect, useState, useCallback, useRef } from "react";
// import { XMC } from "@sitecore-marketplace-sdk/xmc";

// export interface MarketplaceClientState {
//     client: ClientSDK | null;
//     error: Error | null;
//     isLoading: boolean;
//     isInitialized: boolean;
// }

// // Singleton to avoid re-initialization
// let clientInstance: ClientSDK | undefined = undefined;

// async function initializeClient(): Promise<ClientSDK> {
//     if (clientInstance) return clientInstance;

//     const config = {
//         target: window.parent,
//     };
//     const client = await ClientSDK.init(config);
//     clientInstance = client;
//     return client;
// }

// export function useMarketplaceClient(): MarketplaceClientState {
//   const [state, setState] = useState<MarketplaceClientState>({
//     client: clientInstance || null,
//     error: null,
//     isLoading: !clientInstance,
//     isInitialized: !!clientInstance,
//   });

//   const isInitializing = useRef(false);

//   const initialize = useCallback(async () => {
//     if (isInitializing.current || clientInstance) return;

//     isInitializing.current = true;
//     setState(prev => ({ ...prev, isLoading: true }));

//     try {
//       const client = await initializeClient();
//       setState({
//         client,
//         error: null,
//         isLoading: false,
//         isInitialized: true,
//       });
//       console.log("Marketplace SDK initialized");
//       console.log("Marketplace SDK State: ", state);
//     } catch (error) {
//       const err = error instanceof Error ? error : new Error(String(error));
//       console.error("SDK initialization failed:", err);
//       setState({
//         client: null,
//         error: err,
//         isLoading: false,
//         isInitialized: false,
//       });
//     } finally {
//       isInitializing.current = false;
//     }
//   }, []);

//   useEffect(() => {
//     if (!clientInstance && !isInitializing.current) {
//       initialize();
//     }
//   }, [initialize]);

//   return state;
// }