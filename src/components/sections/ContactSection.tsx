import React from 'react';
import { motion } from 'motion/react';
import { Mail, Github, Linkedin, Phone, Send } from 'lucide-react';
import { Contact } from '../../lib/supabase';
import { HoverGlowButton } from '../ui/HoverGlowButton';

export const ContactSection = ({ contact }: { contact: Contact }) => {
  return (
    <section id="contact" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="glass rounded-[60px] p-12 md:p-24 relative overflow-hidden border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "200px" }}
          transition={{ duration: 0.6 }}
          className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20"
        >
          <div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-8 leading-tight">
              Let's build the <span className="text-emerald-500">next intelligence</span>.
            </h2>
            <p className="text-muted-foreground text-lg mb-12 max-w-md">
              Open for collaborations in Generative AI, LLM orchestration, and intelligent automation systems.
            </p>
            
            <div className="space-y-6">
              <a href={`mailto:${contact.email}`} className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors group">
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all shrink-0">
                  <Mail size={20} />
                </div>
                <span className="font-medium break-all">{contact.email}</span>
              </a>
              <a href={contact.linkedin} target="_blank" className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors group">
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all shrink-0">
                  <Linkedin size={20} />
                </div>
                <span className="font-medium">LinkedIn Profile</span>
              </a>
              <a href={contact.github} target="_blank" className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors group">
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all shrink-0">
                  <Github size={20} />
                </div>
                <span className="font-medium">GitHub Repositories</span>
              </a>
            </div>
          </div>

          <div className="glass p-6 md:p-12 rounded-[40px] border-white/5">
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Full Name</label>
                <input type="text" className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:border-emerald-500/50 transition-colors" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Email Address</label>
                <input type="email" className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:border-emerald-500/50 transition-colors" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Message</label>
                <textarea className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:border-emerald-500/50 transition-colors h-32" placeholder="How can I help you?" />
              </div>
              <HoverGlowButton className="w-full">
                <Send size={18} />
                Send Message
              </HoverGlowButton>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
