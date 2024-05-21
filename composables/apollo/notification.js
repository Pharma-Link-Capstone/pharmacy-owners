export default function (query) {
  const { onResult, loading, onError, refetch, fetchMore } = useQuery(
    query,
    null,
    () => ({
      fetchPolicy: "network-only",
      clientId: "admin",
      pollInterval: 10000, //update count every minute
      context: {
        headers: {
          "x-hasura-role": "super:admin",
        },
      },
    })
  );

  return {
    onResult,
    loading,
    refetch,
    onError,
    fetchMore,
  };
}
