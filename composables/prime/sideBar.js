
export default {
    sidebar: {
        root: ({ props }) => ({
            class: [
                'flex flex-col pointer-events-auto relative transform translate-x-0 translate-y-0 translate-z-0 relative transition-transform duration-300',
                'bg-white text-gray-700 border-0 shadow-lg',
                {
                    '!transition-none !transform-none !w-screen !h-screen !max-h-full !top-0 !left-0': props.position == 'full',
                    'h-full w-80': props.position == 'left' || props.position == 'right',
                    'h-40 w-full': props.position == 'top' || props.position == 'bottom',

                },
                'dark:border dark:border-blue-900/40 dark:bg-gray-900 dark:text-white/80'
            ]
        }),
        header: {
            class: ['flex items-center justify-end', 'p-5']
        },
        closeButton: {
            class: [
                'flex items-center justify-center overflow-hidden relative',
                'w-8 h-8 text-gray-500 border-0 bg-transparent rounded-full transition duration-200 ease-in-out mr-2 last:mr-0',
                'hover:text-gray-700 hover:border-transparent hover:bg-gray-200',
                'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]', // focus
                'dark:hover:text-white/80 dark:hover:text-white/80 dark:hover:border-transparent dark:hover:bg-gray-800/80 dark:focus:shadow-[inset_0_0_0_0.2rem_rgba(147,197,253,0.5)]'
            ]
        },
        closeButtonIcon: 'w-4 h-4 inline-block',
        content: {
            class: ['p-5 pt-0 h-full w-full', 'grow overflow-y-auto']
        },
        mask: {
            class: ['flex pointer-events-auto', 'bg-black bg-opacity-40 transition duration-200 z-20 transition-colors']
        },
        transition: ({ props }) => {
            return props.position === 'top'
                ? {
                    enterFromClass: 'translate-x-0 -translate-y-full translate-z-0',
                    leaveToClass: 'translate-x-0 -translate-y-full translate-z-0'
                }
                : props.position === 'bottom'
                    ? {
                        enterFromClass: 'translate-x-0 translate-y-full translate-z-0',
                        leaveToClass: 'translate-x-0 translate-y-full translate-z-0'
                    }
                    : props.position === 'left'
                        ? {
                            enterFromClass: '-translate-x-full translate-y-0 translate-z-0',
                            leaveToClass: '-translate-x-full translate-y-0 translate-z-0'
                        }
                        : props.position === 'right'
                            ? {
                                enterFromClass: 'translate-x-full translate-y-0 translate-z-0',
                                leaveToClass: 'translate-x-full translate-y-0 translate-z-0'
                            }
                            : {
                                enterFromClass: 'opacity-0',
                                enterActiveClass: 'transition-opacity duration-400 ease-in',
                                leaveActiveClass: 'transition-opacity duration-400 ease-in',
                                leaveToClass: 'opacity-0'
                            };
        }
    }
}
