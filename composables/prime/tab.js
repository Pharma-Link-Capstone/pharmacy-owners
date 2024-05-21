export default {
    tabview: {
        navContainer: ({ props }) => ({
            class: [
                "relative", // Relative positioning.
                { "overflow-hidden": props.scrollable }, // Overflow condition.
            ],
        }),
        navContent: {
            class: "overflow-y-hidden overscroll-contain overscroll-auto scroll-smooth [&::-webkit-scrollbar]:hidden", // Overflow and scrollbar styles.
        },
        previousButton: {
            class: [
                "h-full flex items-center justify-center !absolute top-0 z-20",
                "left-0",
                "bg-white text-primary-500 w-12 shadow-md rounded-none",
                "dark:bg-gray-900 dark:border-primary-900/40 dark:text-white/80 ]",
            ], // Flex and absolute positioning styles.
        },
        nextButton: {
            class: [
                "h-full flex items-center justify-center !absolute top-0 z-20",
                "right-0",
                "bg-white text-primary-500 w-12 shadow-md rounded-none",
                "dark:bg-gray-900 dark:border-primary-900/40 dark:text-white/80 ",
            ], // Flex and absolute positioning styles.
        },
        nav: {
            class: [
                "flex flex-1 list-none m-0 p-0",
                "bg-transparent border border-gray-300 border-0 border-b-2",
                "dark:border-primary-900/40 dark:text-white/80 ",
            ], // Flex, list, margin, padding, and border styles.
        },
        tabpanel: {
            header: ({ props }) => ({
                class: [
                    "mr-0",
                    {
                        "cursor-default pointer-events-none select-none select-none opacity-60":
                            props?.disabled,
                    },
                ], // Margin and condition-based styles.
            }),
            headerAction: ({ parent, context }) => ({
                class: [
                    "items-center cursor-pointer flex overflow-hidden relative select-none text-decoration-none select-none", // Flex and overflow styles.
                    "border-b-2 p-5 font-bold rounded-t-md transition-shadow duration-200 m-0", // Border, padding, font, and transition styles.
                    "transition-colors duration-200", // Transition duration style.
                    "focus:outline-none focus:outline-offset-0 focus:shadow-[inset_0_0_0_0.2rem_rgba(191,219,254,0)] dark:focus:shadow-[inset_0_0_0_0.2rem_rgba(147,197,253,0)]", // Focus styles.
                    {
                        "border-gray-300 bg-white text-gray-700 hover:bg-white hover:border-gray-400 hover:text-gray-600 dark:bg-gray-900 dark:border-primary-900/40 dark:text-white/80 dark:hover:bg-gray-800/80":
                            parent.state.d_activeIndex !== context.index, // Condition-based hover styles.
                        "bg-white border-primary-500 text-primary-500 dark:bg-gray-900 dark:border-primary-300 dark:text-primary-300":
                            parent.state.d_activeIndex === context.index, // Condition-based active styles.
                    },
                ],
                style: "margin-bottom:-2px", // Negative margin style.
            }),
            headerTitle: {
                class: ["leading-none whitespace-nowrap"], // Leading and whitespace styles.
            },
            content: {
                class: [
                    "bg-white p-5 border-0 text-gray-700 rounded-bl-md rounded-br-md",
                    "dark:bg-gray-900 dark:border-primary-900/40 dark:text-white/80",
                ], // Background, padding, border, and text styles.
            },
        },
    },
};
