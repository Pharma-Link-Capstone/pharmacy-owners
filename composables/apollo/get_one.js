/**
 * A composable for query by id
 * @param {*} query
 * @param {*} id
 * @param {*} additionalParams
 * @param {*} enabled
 * @param {*} clientId
 * @returns
 */

const _role = ref("pharmacist");
const _enabled = ref(true);
export default function (
  query,
  id,
  role = _role,
  enabled = _enabled,
  additionalParams = {},
  clientId = "authenticated"
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
          "x-hasura-role": role.value,
          // "x-hasura-admin-secret": "myadminsecretkey",
        },
      },

      enabled: enabled.value,
    })
  );

  return {
    onResult,
    loading,
    refetch,
    onError,
  };
}
