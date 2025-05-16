
export const containerVariants = {
  collapsed: {
    height: 64,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
  expanded: {
    height: 110,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

export const placeholderContainerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.025 } },
  exit: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
};

export const letterVariants = {
  initial: {
    opacity: 0,
    filter: "blur(12px)",
    y: 10,
  },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      opacity: { duration: 0.25 },
      filter: { duration: 0.4 },
      y: { type: "spring", stiffness: 80, damping: 20 },
    },
  },
  exit: {
    opacity: 0,
    filter: "blur(12px)",
    y: -10,
    transition: {
      opacity: { duration: 0.2 },
      filter: { duration: 0.3 },
      y: { type: "spring", stiffness: 80, damping: 20 },
    },
  },
};
