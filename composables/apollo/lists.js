import { ref } from "vue";

const enable = ref(true);
const offset_ = ref(0);
const limit_ = ref(100);
const filter_ = ref({});

const role_ = ref("super:admin");

const client_ = ref("admin");

const order_ = ref([]);

export default function (
  query,
  {
    filter = filter_,
    order = order_,
    limit = limit_,
    offset = offset_,
    enabled = enable,
    role = role_,
    client = client_,
  }
) {
  console.log("order", order);
  const { onResult, onError, loading, refetch } = useQuery(
    query,
    () => ({
      limit: limit && limit?.value ? limit.value : undefined,
      filter: filter && filter.value ? filter.value : {},
      order: order && order?.value.length ? order.value : undefined,
      offset: offset && offset?.value ? offset.value : undefined,
    }),
    () => ({
      fetchPolicy: "no-cache",
      clientId: client.value,
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
