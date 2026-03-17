import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ExternalLink, X } from 'lucide-react';
import { type Achievement } from '../../lib/supabase';
import { createPortal } from 'react-dom';

// Renamed internally but keeping file logic intact for imports
export const CardFlip = ({ achievement }: { achievement: Achievement }) => {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const CardContent = (
    <motion.div 
      className="relative w-full h-full flex flex-col p-8 glass rounded-[32px] border-white/5 hover:border-emerald-500/20 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-colors group overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (achievement.certificate_url) {
          setIsModalOpen(true);
        }
      }}
      initial={false}
      animate={{ scale: isHovered ? 1.05 : 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-start justify-between mb-6 z-10 relative">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
          <Award size={24} />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-emerald-500/50 uppercase tracking-widest">{achievement.year}</div>
          {achievement.certificate_url && (
            <div className="text-emerald-500/50 group-hover:text-emerald-400 transition-colors">
              <ExternalLink size={16} />
            </div>
          )}
        </div>
      </div>
      
      <div className="z-10 relative flex-grow flex flex-col justify-center">
        <h3 className="text-xl font-bold text-foreground mb-2 leading-tight">{achievement.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{achievement.issuer}</p>
      </div>

      {/* Subtle hover glow inside the card */}
      <motion.div 
        className="absolute inset-0 z-0 bg-emerald-500/5 mix-blend-screen pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );

  const isPdf = achievement.certificate_url?.toLowerCase().includes('.pdf');

  return (
    <>
      <div className="w-full h-full">
        {CardContent}
      </div>

      {/* Certificate Modal - Using Portal to escape section-based content-visibility */}
      {mounted && createPortal(
        <AnimatePresence>
          {isModalOpen && achievement.certificate_url && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 overflow-hidden"
              onClick={() => setIsModalOpen(false)}
              style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100dvh',
                zIndex: 999999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.95)'
              }}
              data-lenis-prevent
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="relative w-full max-w-6xl h-[85vh] md:h-[90vh] glass rounded-[40px] border border-white/10 overflow-hidden flex flex-col bg-zinc-950/95 shadow-[0_40px_100px_rgba(0,0,0,1)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-5 md:p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/40 backdrop-blur-md">
                  <div className="pr-4">
                    <h3 className="font-display font-bold text-zinc-100 text-xl md:text-2xl tracking-tight">{achievement.title}</h3>
                    <p className="text-emerald-400 font-medium text-sm md:text-base opacity-90">{achievement.issuer} • {achievement.year}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <a 
                      href={achievement.certificate_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 text-zinc-400 hover:text-emerald-400 bg-white/5 rounded-2xl hover:bg-white/10 transition-all active:scale-95"
                      title="Open in new tab"
                    >
                      <ExternalLink size={22} />
                    </a>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="p-3 text-zinc-400 hover:text-white bg-white/5 rounded-2xl hover:bg-white/10 transition-all active:scale-95"
                    >
                      <X size={22} />
                    </button>
                  </div>
                </div>

                {/* Modal Content / Viewer */}
                <div className="flex-grow relative bg-black/40 overflow-hidden flex items-center justify-center p-4 md:p-10">
                  <div className="w-full h-full flex items-center justify-center bg-zinc-950/50 rounded-2xl border border-white/5 shadow-inner">
                    {isPdf ? (
                      <iframe 
                        src={achievement.certificate_url} 
                        className="w-full h-full border-none outline-none max-w-5xl mx-auto rounded-xl shadow-2xl"
                        title="Certificate PDF Viewer"
                      />
                    ) : (
                      <img 
                        src={achievement.certificate_url}
                        alt={`${achievement.title} Certificate`}
                        className="max-w-full max-h-full object-contain rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.8)] mx-auto"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
