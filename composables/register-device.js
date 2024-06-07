import { getToken } from "firebase/messaging";
import registerDeviceMutation from "@/graphql/notification/register-device.gql";
import testNotificationPermission from "@/helper/check-notification-permission";
import mutator from "./apollo/mutator";

/* --------------------------- Register device On Database--------------------------- */
const { mutate, onError, loading, onDone } = mutator(registerDeviceMutation);
onDone((result) => {
  console.log("Device Is Registered");
});
onError((error) => {
  console.warn("Already Device Registered");
});

export default function () {
  const { $messaging } = useNuxtApp();
  const registerDevice = async () => {
    const permission = await testNotificationPermission();
    if (!permission) {
      return;
    } else {
    }
    try {
      const token = await getToken($messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAP_ID,
      });

      // send token to server
      mutate({
        deviceToken: token,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.warn("Registration Failed");
      }
    }
  };
  return {
    registerDevice,
  };
}
