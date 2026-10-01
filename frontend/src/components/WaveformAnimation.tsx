import { motion } from 'framer-motion';

export function WaveformAnimation() {
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-primary rounded-full"
          initial={{ height: "20%" }}
          animate={{ height: ["20%", "100%", "20%"] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
