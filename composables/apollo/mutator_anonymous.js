import useNotify from "@/use/notify";
import useErrorParser from "@/use/errorParser";

const { notify } = useNotify();
const { parse } = useErrorParser();

export default function (query) {
  const { mutate, onDone, loading, onError } = useMutation(query, () => ({
    fetchPolicy: "network-only",
    // clientId: "auth",
  }));

  onError((err) => notify(parse(err)));

  return {
    mutate,
    loading,
    onDone,
    onError,
  };
}
