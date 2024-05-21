export const TRANSITIONS = {
    toggleable: {
        enterFromClass: "max-h-0",
        enterActiveClass:
            "overflow-hidden transition-all duration-500 ease-in-out",
        enterToClass: "max-h-40	",
        leaveFromClass: "max-h-40",
        leaveActiveClass: "overflow-hidden transition-all duration-500 ease-in",
        leaveToClass: "max-h-0",
    },
};

export default {
    accordion: {
        root: "mb-0",
        accordiontab: {
            root: "mb-0",
            header: ({ props }) => ({
                class: [
                    {
                        "select-none pointer-events-none cursor-default opacity-60":
                            props?.disabled,
                    }, // Condition
                ],
            }),
            headerAction: ({ context }) => ({
                class: [
                    "group grid grid-cols-12 items-center justify-between gap-x-4 cursor-pointer relative no-underline select-none", // Alignments
                    "py-5 lg:px-5 transition duration-200 ease-in-out font-medium transition-shadow duration-200", // Padding and transition
                    "border-t border-gray-300  text-gray-600", // Borders and colors
                    "dark:bg-gray-50 dark:border-blue-900/40 dark:text-white/80 dark:hover:bg-gray-50/80 dark:focus:shadow-[inset_0_0_0_0.2rem_rgba(147,197,253,0)]", // Dark mode
                    " ", // Hover
                    "focus:outline-none focus:outline-offset-0 focus:shadow-[inset_0_0_0_0.2rem_rgba(191,219,254,0)]", // Focus
                    {
                        "": !context.active,
                        "text-gray-800": context.active,
                    }, // Condition
                ],
            }),
            headerIcon: ({ context }) => ({
                class: [
                    "col-span-1 order-last ml-auto group-hover:text-primary-600",
                    {
                        "!rotate-90": !context.active,
                        "!rotate-180": context.active,
                    }, // Condition
                ],
            }),
            headerTitle: "leading-none col-span-11 order-first",
            content: {
                class: [
                    "pb-5 pl-2 lg:px-5 bg-white text-gray-700",
                    "dark:bg-gray-900 dark:border-blue-900/40 dark:text-white/80", // Dark mode
                ],
            },
            transition: TRANSITIONS.toggleable,
        },
    },
};
