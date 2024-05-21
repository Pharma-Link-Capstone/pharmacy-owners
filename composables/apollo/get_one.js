/**
 * A composable for query by id
 * @param {*} query
 * @param {*} id
 * @param {*} additionalParams
 * @param {*} enabled
 * @param {*} clientId
 * @returns
 */
export default function (
  query,
  id,
  additionalParams = {},
  enabled = {},
  clientId = "admin"
) {
  const { onResult, loading, onError, refetch } = useQuery(
    query,
    () => ({
      id,
      ...additionalParams.value,
    }),
    () => ({
      fetchPolicy: "network-only",
      clientId: clientId || "admin",
      context: {
        headers: {
          "x-hasura-role": "super:admin",
          // "x-hasura-admin-secret": "myadminsecretkey",
        },
      },
    })
  );

  return {
    onResult,
    loading,
    refetch,
    onError,
  };
}
