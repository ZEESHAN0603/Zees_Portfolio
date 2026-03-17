import React from 'react';
import { motion } from 'motion/react';
import { About } from '../../lib/supabase';

export const AboutSection = ({ about }: { about: About }) => {
  return (
    <section id="about" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "200px" }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl rounded-full" />
          <div className="relative aspect-square rounded-full overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src={about.profile_image || "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=800&fit=crop"} 
              alt={about.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay" />
          </div>
          
          {/* Decorative elements */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-10 -right-10 w-40 h-40 border border-emerald-500/20 rounded-full border-dashed"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "200px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Aspiring AI Engineer
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-8 leading-tight">
            {about.title}
          </h2>
          <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
            {about.description.split('\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-12">
            <div className="glass p-6 rounded-3xl">
              <div className="text-3xl font-bold text-foreground mb-1">10+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">AI Models Deployed</div>
            </div>
            <div className="glass p-6 rounded-3xl">
              <div className="text-3xl font-bold text-foreground mb-1">SIH</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Grand Finalist</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
