import { motion } from 'framer-motion';

const config = {
  variants: {
    initial: { opacity: 0, x: 50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 },
  },
  initial: 'initial',
  animate: 'in',
  exit: 'out',
  transition: {
    duration: 0.3,
  },
};

export function AnimateView({ ...props }: any) {
  return <motion.div {...config} {...props} />;
}
