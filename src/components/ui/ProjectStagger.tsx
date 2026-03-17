import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { Project } from '../../lib/supabase';

interface ProjectStaggerProps {
  projects: Project[];
}

export const ProjectStagger: React.FC<ProjectStaggerProps> = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardSize, setCardSize] = useState(300);

  useEffect(() => {
    const updateSize = () => {
      setCardSize(window.innerWidth < 400 ? 280 : 320);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <div className="relative w-full h-[650px] flex flex-col items-center justify-center overflow-hidden py-10">
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {projects.map((project, index) => {
            // Calculate relative position based on currentIndex
            let position = index - currentIndex;
            if (position < -1) position += projects.length;
            if (position > projects.length - 2) position -= projects.length;

            // Only render current and neighbors for better stack look
            const isVisible = position >= -1 && position <= 1;
            if (!isVisible) return null;

            const isCenter = position === 0;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: isVisible ? (isCenter ? 1 : 0.6) : 0,
                  scale: isCenter ? 1 : 0.9,
                  x: position * (cardSize * 0.45),
                  y: isCenter ? -20 : (position % 2 ? 15 : -15),
                  rotate: isCenter ? 0 : (position % 2 ? 3 : -3),
                  z: isCenter ? 50 : 0,
                }}
                exit={{ opacity: 0, scale: 0.5, x: position * -100 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={cn(
                  "absolute min-h-[500px] rounded-[32px] glass-dark border-white/10 overflow-visible shadow-2xl flex flex-col transition-shadow",
                  isCenter ? "z-20 border-emerald-500/40 shadow-emerald-500/10" : "z-10 pointer-events-none"
                )}
                style={{ width: cardSize }}
              >
                <div className="relative aspect-video rounded-t-[32px] overflow-hidden">
                  <img
                    src={project.image || ''}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                
                <div className="p-6 flex flex-col flex-grow bg-zinc-950/20 backdrop-blur-[2px]">
                  <h3 className="text-xl font-bold text-zinc-100 mb-3 drop-shadow-md">{project.title}</h3>
                  <div className="overflow-y-auto max-h-[160px] no-scrollbar">
                    <p className="text-zinc-300 text-sm leading-relaxed mb-6 drop-shadow-sm font-medium">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="mt-auto flex items-center gap-4 pt-4 border-t border-white/5">
                    {project.live_link && (
                      <a href={project.live_link} target="_blank" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <ExternalLink size={16} />
                        Demo
                      </a>
                    )}
                    {project.github_link && (
                      <a href={project.github_link} target="_blank" className="p-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors border border-white/10">
                        <Github size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-8 z-30">
        <button
          onClick={handlePrev}
          className="p-4 rounded-full glass-dark border-white/10 text-white hover:text-emerald-400 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="p-4 rounded-full glass-dark border-white/10 text-white hover:text-emerald-400 transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};
