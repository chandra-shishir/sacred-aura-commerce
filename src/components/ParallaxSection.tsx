import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  direction?: "up" | "down";
}

const ParallaxSection = ({ children, speed = 0.3, className = "", direction = "up" }: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const factor = direction === "up" ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed * factor, -100 * speed * factor]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, opacity }}>
        {children}
      </motion.div>
    </div>
  );
};

export const ParallaxImage = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y, scale }}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export const RevealOnScroll = ({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerContainer = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-60px" }}
    variants={{
      visible: { transition: { staggerChildren: 0.12 } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 40, scale: 0.95 },
      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export default ParallaxSection;
