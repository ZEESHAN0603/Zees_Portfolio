import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../lib/utils';

interface HoverGlowButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const HoverGlowButton = ({ variant = 'primary', children, className, ...props }: HoverGlowButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative group px-8 py-4 rounded-2xl font-bold transition-all duration-300 overflow-hidden",
        variant === 'primary' 
          ? "bg-emerald-500 text-zinc-950 hover:bg-emerald-400" 
          : "glass text-foreground hover:bg-white/10",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {variant === 'primary' && (
        <div className="absolute inset-0 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </motion.button>
  );
};
