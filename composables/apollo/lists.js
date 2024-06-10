import { ref } from "vue";

const enable = ref(true);
const offset_ = ref(0);
const limit_ = ref(100);
const filter_ = ref({});

const role_ = ref("pharmacist");

const client_ = ref("authenticated");

const order_ = ref([]);

const poll_ = ref(0);

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
    poll = poll_,
  }
) {
  console.log("lists.js: query", role.value);
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
        },
      },
      enabled: enabled.value,
      pollInterval: poll.value,
    })
  );
  return {
    onResult,
    loading,
    refetch,
    onError,
  };
}
