import { defineApolloClient } from "@nuxtjs/apollo";
export default defineApolloClient({
  httpEndpoint: process.env.GRAPHQL_URL,
  httpLinkOptions: {},
  defaultOptions: {},
  inMemoryCacheOptions: {},
});
