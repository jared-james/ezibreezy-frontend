// lib/utils/get-query-client.ts

import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

// 'cache' ensures we get the same client per request,
// but a new one for each new user request.
const getQueryClient = cache(() => new QueryClient());
export default getQueryClient;
