import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Home, User, Cpu, Layout, Mail } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'About', href: '#about', icon: User },
  { name: 'Skills', href: '#skills', icon: Cpu },
  { name: 'Projects', href: '#projects', icon: Layout },
  { name: 'Contact', href: '#contact', icon: Mail },
];

const DockIcon = ({ icon: Icon, href, mouseX }: { icon: any, href: string, mouseX: any }) => {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-100, 0, 100], [45, 70, 45]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <a href={href} className="group relative">
      <motion.div
        ref={ref}
        style={{ width }}
        className="aspect-square rounded-full glass flex items-center justify-center text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
      >
        <Icon size={24} />
      </motion.div>
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-zinc-900 border border-white/10 text-[10px] text-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {href.substring(1).charAt(0).toUpperCase() + href.substring(2)}
      </span>
    </a>
  );
};

export const NavigationDock = () => {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="glass px-4 py-3 rounded-full flex items-end gap-3 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        {navItems.map((item) => (
          <DockIcon 
            key={item.name} 
            icon={item.icon} 
            href={item.href} 
            mouseX={mouseX} 
          />
        ))}
      </motion.div>
    </div>
  );
};
