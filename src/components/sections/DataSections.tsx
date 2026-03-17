import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Award, Calendar } from 'lucide-react';
import { Experience, Achievement } from '../../lib/supabase';
import { CardFlip } from '../ui/CardFlip';

export const ExperienceTimeline = ({ experience }: { experience: Experience[] }) => {
  return (
    <div className="relative max-w-4xl mx-auto py-12">
      <div className="absolute left-2 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden sm:block" />
      
      {experience.map((exp, index) => (
        <motion.div
          key={exp.id}
          initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "200px" }}
          transition={{ delay: index * 0.1 }}
          className={`relative flex flex-col md:flex-row gap-8 mb-12 sm:mb-20 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
        >
          {/* Dot */}
          <div className="absolute left-2 md:left-1/2 top-10 w-4 h-4 rounded-full bg-emerald-500 glow-emerald -translate-x-1/2 z-10 hidden sm:block" />
          
          <div className="w-full md:w-1/2">
            <div className={`glass p-6 md:p-8 rounded-[32px] border-white/5 hover:border-emerald-500/20 transition-colors group ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
              <div className={`flex items-center gap-2 mb-4 text-emerald-400 font-mono text-sm ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                <Calendar size={14} />
                <span>{exp.start_date} — {exp.end_date}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1 group-hover:text-emerald-400 transition-colors">{exp.role}</h3>
              <div className={`text-muted-foreground font-medium mb-4 flex items-center gap-2 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                <Briefcase size={14} />
                {exp.company}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{exp.description}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 hidden md:block" />
        </motion.div>
      ))}
    </div>
  );
};

export const AchievementCards = ({ achievements }: { achievements: Achievement[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto py-12">
      {achievements.map((achievement, index) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "200px" }}
          transition={{ delay: index * 0.1 }}
        >
          <CardFlip achievement={achievement} />
        </motion.div>
      ))}
    </div>
  );
};
