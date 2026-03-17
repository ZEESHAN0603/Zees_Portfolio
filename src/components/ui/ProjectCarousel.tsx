import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ExternalLink, Github } from 'lucide-react';
import { Project } from '../../lib/supabase';
import { cn } from '../../lib/utils';

import { Tilt } from './tilt';
import { Spotlight } from './spotlight';

interface ProjectCarouselProps {
  projects: Project[];
}

export const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ projects }) => {
  return (
    <div className="relative w-full py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
        {projects.map((project, index) => (
          <ProjectCard key={project.id || index} project={project} index={index} />
        ))}
      </div>
    </div>
  );
};

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  return (
    <Tilt
      rotationFactor={8}
      isRevese
      className="w-full"
      springOptions={{ stiffness: 300, damping: 30 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="group flex flex-col h-full rounded-2xl overflow-hidden glass-dark border border-white/10 transition-all duration-500 hover:border-emerald-500/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] bg-zinc-950/40"
      >
        <Spotlight
          className="z-10 from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none"
          size={300}
        />
        
        {/* Project Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={project.image || ''}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        </div>

        {/* Project Content - Now BELOW the image */}
        <div className="p-6 flex flex-col flex-grow space-y-4">
          <h3 className="text-2xl font-display font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
            {project.title}
          </h3>
          
          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-4">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tech_stack?.map((tech) => (
              <span 
                key={tech} 
                className="px-3 py-1 rounded-md bg-emerald-500/5 border border-emerald-500/10 text-emerald-400/80 text-[10px] font-bold uppercase tracking-wider"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4 mt-auto">
            {project.live_link && (
              <a 
                href={project.live_link} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95"
              >
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
            {project.github_link && (
              <a 
                href={project.github_link} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 text-white font-bold text-xs hover:bg-white/10 transition-all hover:scale-105 active:scale-95 border border-white/10"
              >
                <Github size={14} />
                Source
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </Tilt>
  );
};

