import { useMutation } from "@vue/apollo-composable";
import useNotify from "@/use/notify";
import useErrorParser from "@/use/errorParser";

const { notify } = useNotify();
const { parse } = useErrorParser();

export default function (query, role = "user", clientId = "authenticated") {
  const { mutate, onDone, loading, onError } = useMutation(query, () => ({
    fetchPolicy: "network-only",
    clientId: clientId,
    context: {
      headers: {
        "x-hasura-role": role,
        // "x-hasura-admin-secret": "myadminsecretkey",
      },
    },
  }));

  onError((err) => notify(parse(err)));

  return {
    mutate,
    loading,
    onDone,
    onError,
  };
}
