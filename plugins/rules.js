import { defineRule } from "vee-validate";

export default defineNuxtPlugin((vueApp) => {
  defineRule("onerequired", (value, [], ctx) => {
    return !!value || value?.length || "At least one selection required";
  }),
    defineRule("required_for", (value, _, ctx) => {
      if (value === null || value === undefined || value === "") {
        return "Field Required";
      }
      return value?.length ? value?.length : "Field Required";
    });
  defineRule("required", (value, [], ctx) => {
    return !!value || value?.length || "Field Required";
  }),
    defineRule("boolReq", (value, [], ctx) => {
      return typeof value == "boolean" || "Field Required";
    });
  defineRule("array_object_required", (value, [], ctx) => {
    return value?.length || "Please select at least one option";
  }),
    defineRule("yes_or_no", (value, [], ctx) => {
      return value?.length || "Field Required";
    }),
    defineRule("dyarrayrequired", (value, [], ctx) => {
      return (
        ctx.rule.params[0]?.includes("No_savings") ||
        value?.length ||
        "Field Required"
      );
    }),
    defineRule("dyrequired", (value, [], ctx) => {
      return (
        ctx.rule.params[0] == "no" ||
        ctx.rule.params[0] == "No" ||
        ctx.rule.params[0] == undefined ||
        ctx.rule.params[0] == "sole_proprietorship" ||
        (typeof ctx.rule.params[0] == "boolean" &&
          ctx.rule.params[0] == false) ||
        !!value ||
        value?.length ||
        "Field Required"
      );
    }),
    defineRule("arrya_object_dyrequired", (value, [], ctx) => {
      return (
        ctx.rule.params[0] == "no" ||
        ctx.rule.params[0] == "No" ||
        ctx.rule.params[0] == undefined ||
        value?.length ||
        "Field Required"
      );
    });
  defineRule("dyrequirednot", (value, [], ctx) => {
    return (
      ctx.rule.params[0] == "yes" ||
      ctx.rule.params[0] == "Yes" ||
      ctx.rule.params[0] == undefined ||
      ctx.rule.params[0] == "sole_proprietorship" ||
      !!value ||
      value?.length ||
      "Field Required"
    );
  }),
    defineRule("validCoordinates", (value) => {
      const regex = /^[-+]?\d*\.?\d+,\s*[-+]?\d*\.?\d+$/;

      if (!value?.match(regex)) {
        return "Invalid coordinates format";
      }

      return true;
    }),
    defineRule("number", (value) => {
      return !value || /^[0-9]+$/.test(value) || "Number only";
    }),
    defineRule("numrange", (value) => {
      return !value || /^[0-9-]+$/.test(value) || "Number only";
    }),
    defineRule("email", (value) => {
      return (
        !value ||
        /[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
          value
        ) ||
        "Not Valid Email"
      );
    }),
    defineRule("International_phone_number", (value) => {
      return (
        !value ||
        /^\+(?:[0-9] ?){6,14}[0-9]$/.test(value) ||
        "Not valid phone number"
      );
    }),
    defineRule("ethiopian_phone_number", (value) => {
      return !value || /^(7|9)\d{8}$/.test(value) || "Not valid phone number";
    }),
    defineRule("ethio_phone", (value) => {
      return !value || /^(7|9)\d{8}$/.test(value) || "Not valid phone number";
    }),
    defineRule("password", (value) => {
      return !value || value.length >= 8 || "Must be greater than 8";
    }),
    defineRule("confirmed", (value, [other]) => {
      return !value || value === other || "Password is not the same";
    }),
    defineRule("url", (value) => {
      return (
        !value || /^(http|https):\/\/[^ "]+$/.test(value) || "Not valid URL"
      );
    });
  defineRule("minDate", (value, [minDate]) => {
    return !value || new Date(value) >= new Date(minDate) || "Date is too old";
  });
  defineRule("maxDate", (value, [maxDate]) => {
    return (
      !value ||
      new Date(value) <= new Date(maxDate) ||
      "Date is too far in the future"
    );
  });
  defineRule("min", (value, [min]) => {
    return !value || value >= min || `Must be greater than ${min}`;
  });
  defineRule("max", (value, [max]) => {
    return !value || value <= max || `Must be lower than ${max}`;
  });
  defineRule("unsigned", (value) => {
    return !value || value >= 0 || "Must be a positive number";
  });
  defineRule("positive", (value) => {
    return !value || value > 0 || "Must be a positive number";
  });
  defineRule("integer", (value) => {
    return !value || Number.isInteger(Number(value)) || "Must be an integer";
  });
});
