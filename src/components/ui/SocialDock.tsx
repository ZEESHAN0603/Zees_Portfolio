import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Github, Linkedin, Mail, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

const DockIcon = ({ icon: Icon, mouseX }: { icon: any, mouseX: any }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="aspect-square rounded-full glass flex items-center justify-center text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
    >
      <Icon size={24} />
    </motion.div>
  );
};

export const SocialDock = ({ 
  github = 'https://github.com', 
  linkedin = 'https://linkedin.com', 
  email = 'mailto:zeeshanahmedali.s@email.com',
  resume = '#'
}: { 
  github?: string, 
  linkedin?: string, 
  email?: string,
  resume?: string
}) => {
  const mouseX = useMotionValue(Infinity);
  
  const items = [
    { icon: Github, href: github },
    { icon: Linkedin, href: linkedin },
    { icon: Mail, href: email.startsWith('mailto:') ? email : `mailto:${email}` },
    { icon: FileText, href: resume },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden md:block">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="glass px-4 py-3 rounded-full flex items-end gap-4 border-white/10 shadow-2xl"
      >
        {items.map((item, i) => {
          const isResume = item.icon === FileText;
          return (
            <div 
              key={i} 
              onClick={() => {
                if (isResume) {
                  import('../../lib/utils').then(m => m.handleDownload(item.href, 'Zeeshan_Ahmed_Ali_S_Resume.pdf'));
                } else {
                  window.open(item.href, '_blank', 'noreferrer');
                }
              }}
            >
              <DockIcon icon={item.icon} mouseX={mouseX} />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
