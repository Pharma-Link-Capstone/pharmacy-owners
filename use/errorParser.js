export default function () {
  const response = {
    invalid_username_or_password: {
      title: "invalid credentials",
      description: "please try_again_with_correct_credentials",
    },
    unexpected: {
      title: "Invalid username or password",
      description: "please try again with correct credentials",
      cardClass: "bg-red-100",
    },
    "Unverified account unexpected": {
      title: "Unverified account",
      description: "please check your email to verify your account",
      cardClass: "bg-red-100",
    },
    users_phone_number_key: {
      title: "Phone number already exists",
      description: "please try again with another phone number",
      cardClass: "bg-red-100",
    },
    users_email_key: {
      title: "Email already exists",
      description: "please try again with another email",
      cardClass: "bg-red-100",
    },
    access_denied: {
      title: "access_denied",
      description: "you_have_no_permission",
      cardClass: "bg-red-100",
    },
    space_floor_id_fkey: {
      title: "you_can't_delete_floor",
      description: "you_have_no_permission",
      cardClass: "bg-red-100",
    },
    "Your requested role is not in allowed roles access-denied": {
      title: "access_denied",
      description: "you_have_no_permission",
      cardClass: "bg-red-100",
    },
    "NetworkError when attempting to fetch resource.": {
      title: "connection failed",
      description: "check you network  connection please",
      cardClass: "bg-red-100",
    },
    "Could not verify JWT: JWTExpired invalid-jwt": {
      title: "session expired",
      description: "session expired please login again",
      cardClass: "bg-red-100",
    },
  };

  const extract = (err) => {
    let msg_compilation = "";
    if (err && err.graphQLErrors) {
      if (err.graphQLErrors.length > 0) {
        const errObject = err.graphQLErrors[0];

        if (
          errObject.extensions &&
          errObject.extensions.internal &&
          errObject.extensions.internal.error
        ) {
          msg_compilation += errObject.extensions.internal.error.message;
          // return errObject.extensions.internal.error.message;
        } else {
          msg_compilation += err.graphQLErrors[0].message;
          if (
            err.graphQLErrors[0].extensions &&
            err.graphQLErrors[0].extensions.code
          ) {
            msg_compilation += ` ${
              err.graphQLErrors[0].extensions &&
              err.graphQLErrors[0].extensions.code
            }`;
          }
          // return `${err.graphQLErrors[0].message}`;
        }
      } else {
        msg_compilation += err.message || " extraction_error";
        // return "extraction_error";
      }
    }
    if (err && err.errors && err.errors.length > 0) {
      msg_compilation += err.errors[0].message;
      // return err.errors[0].message;
    }

    if (typeof err === "string") {
      msg_compilation += err;
      return err;
    }

    console.log("errors", msg_compilation);

    return msg_compilation;
  };

  const parse = (err) => {
    let item = {};

    const msg = extract(err);
    console.log(msg);
    Object.keys(response).forEach((key) => {
      if (msg.includes(key)) {
        item = {
          ...response[key],
          key,
        };
      }
    });

    if (Object.keys(item).length === 0 && msg) {
      item = {
        title: msg,
        key: null,
      };
    }

    return item;
  };

  return {
    parse,
    extract,
  };
}
