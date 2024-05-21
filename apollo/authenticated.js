import { defineApolloClient } from "@nuxtjs/apollo";
export default defineApolloClient({
  httpEndpoint: process.env.GRAPHQL_URL,
  tokenName: "phl_access_token",
  httpLinkOptions: {},
  defaultOptions: {},
  inMemoryCacheOptions: {},
});
