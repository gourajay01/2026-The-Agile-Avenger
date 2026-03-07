
// import { experimental_XMC, XMC } from "@sitecore-marketplace-sdk/xmc";
// import { ClientSDK } from "@sitecore-marketplace-sdk/client";

// export interface MarketplaceClientState {
//     client: ClientSDK | null;
// }

// let xmcInstance: undefined = undefined;

// // export async function initializeXMC(marketplaceClient: ClientSDK): Promise<XMC> {
// export async function initializeXMC(marketplaceClient: ClientSDK){
//   if (xmcInstance) return xmcInstance;

//   xmcInstance = new = XMC({ client: marketplaceClient });
//   await xmcInstance.init();
  
//   console.log("✅ XM Cloud API client initialized");
//   return xmcInstance;
// }

// export function getXMC(): XMC {
//   if (!xmcInstance) {
//     throw new Error("XMC not initialized");
//   }
//   return xmcInstance;
// }