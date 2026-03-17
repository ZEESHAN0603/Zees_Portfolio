import React, { useEffect, useState, useMemo } from 'react';
import { ThemeProvider } from 'next-themes';
import { motion, AnimatePresence } from 'motion/react';
import {
  supabase,
  type Settings,
  type About,
  type Skill,
  type Project,
  type Experience,
  type Achievement,
  type Contact
} from './lib/supabase';

import { GlowMenu } from './components/ui/GlowMenu';
import { NavigationDock } from './components/ui/NavigationDock';
import { SocialDock } from './components/ui/SocialDock';
import { AboutSection } from './components/sections/AboutSection';
import { IconCloudDemo } from './components/sections/icon-cloud-demo';
import { ProjectCarousel } from './components/ui/ProjectCarousel';
import { ExperienceTimeline, AchievementCards } from './components/sections/DataSections';
import { ContactSection } from './components/sections/ContactSection';
import { AnimatedBackground } from './components/ui/AnimatedBackground';
import { HoverGlowButton } from './components/ui/HoverGlowButton';
import { FileDown, ChevronRight, Sparkles } from 'lucide-react';
import { handleDownload } from './lib/utils';
import { ProjectStagger } from './components/ui/ProjectStagger';
import { AdminDashboard } from './AdminDashboard';
import { Settings as SettingsIcon } from 'lucide-react';
import Lenis from 'lenis';
import { ContainerScroll } from './components/ui/container-scroll-animation';

// UI Helpers
const SectionHeading = ({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) => (
  <div className="mb-20 text-center">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "200px" }}
      className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6"
    >
      {children}
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "200px" }}
        transition={{ delay: 0.1 }}
        className="text-zinc-500 text-lg max-w-2xl mx-auto"
      >
        {subtitle}
      </motion.p>
    )}
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: 80 }}
      viewport={{ once: true, margin: "200px" }}
      className="h-1 bg-emerald-500 mx-auto mt-8 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
    />
  </div>
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [data, setData] = useState<{
    settings: Settings;
    about: About;
    skills: Skill[];
    projects: Project[];
    experience: Experience[];
    achievements: Achievement[];
    contact: Contact;
  } | null>(null);

  const defaultData = useMemo(() => {
    return {
      settings: {
        id: '1',
        site_title: 'Zees Portfolio',
        hero_heading: 'Building Intelligent AI Systems',
        hero_subtitle: 'Aspiring B.Tech Artificial Intelligence & Data Science (2023–2027) undergraduate, focused on building AI-driven systems using Generative AI, LLMs, RAG, and Agentic AI.',
        hero_cta_text: 'View Projects',
        resume_url: 'https://fmbcjcgzwdtqnuuvdzah.supabase.co/storage/v1/object/public/Resume/Resume.pdf'
      },
      about: {
        id: '1',
        title: 'Junior AI Engineer',
        description: 'Aspiring B.Tech Artificial Intelligence & Data Science (2023–2027) undergraduate, focused on building AI-driven systems using Generative AI, LLMs, RAG, and Agentic AI. Skilled in Python, SQL, JSON, and Excel, with applied data analysis experience from the AICTE Virtual Internship. Actively strengthening DSA, and advanced machine learning concepts to design scalable, intelligent solutions.',
        profile_image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=800&fit=crop'
      },
      skills: [
        { id: '1', skill_name: 'Python', category: 'Programming', icon: 'Terminal' },
        { id: '2', skill_name: 'Java', category: 'Programming', icon: 'Code2' },
        { id: '3', skill_name: 'JavaScript', category: 'Programming', icon: 'FileCode' },
        { id: '4', skill_name: 'SQL', category: 'Programming', icon: 'Database' },
        { id: '5', skill_name: 'n8n', category: 'Tools', icon: 'Box' },
        { id: '6', skill_name: 'Supabase', category: 'Tools', icon: 'Database' },
        { id: '7', skill_name: 'Git', category: 'Tools', icon: 'GitBranch' },
        { id: '8', skill_name: 'API Integration', category: 'Tools', icon: 'Server' },
        { id: '9', skill_name: 'Google Colab', category: 'Tools', icon: 'Cloud' },
        { id: '10', skill_name: 'VS Code', category: 'Tools', icon: 'Code' },
        { id: '11', skill_name: 'Generative AI', category: 'AI & Data', icon: 'Cpu' },
        { id: '12', skill_name: 'LLMs', category: 'AI & Data', icon: 'Layers' },
        { id: '13', skill_name: 'RAG', category: 'AI & Data', icon: 'Zap' },
        { id: '14', skill_name: 'Machine Learning', category: 'AI & Data', icon: 'Brain' },
        { id: '15', skill_name: 'Data Structures & Algorithms', category: 'Concepts', icon: 'Layout' },
        { id: '16', skill_name: 'Adaptability', category: 'Soft Skills', icon: 'User' },
        { id: '17', skill_name: 'Continuous Learning', category: 'Soft Skills', icon: 'BookOpen' },
        { id: '18', skill_name: 'Team Collaboration', category: 'Soft Skills', icon: 'Users' }
      ],
      projects: [
        {
          id: '1',
          title: 'CURA_BOT – AI Healthcare Assistant',
          description: 'Developed conversational AI chatbot for healthcare guidance with implemented backend workflow for processing user queries and responses.',
          tech_stack: ['Python', 'AI Chatbot Logic'],
          github_link: 'https://github.com/ZEESHAN0603/CURA_BOT',
          live_link: '#',
          image: '/images/Cura%20bot.jpeg',
          featured: true,
          is_visible: true
        },
        {
          id: '2',
          title: 'ZEES-COACH – AI Language Learning Platform',
          description: 'Developed AI-powered chatbot for personalized language learning support and designed backend logic for user interaction and learning recommendations.',
          tech_stack: ['Python', 'AI Chatbot Logic'],
          github_link: 'https://github.com/ZEESHAN0603/ZEES_COACH',
          live_link: '#',
          image: '/images/Zees%20coach.jpeg',
          featured: true,
          is_visible: true
        },
        {
          id: '3',
          title: 'AI-Based Intelligent Event Vendor Management System',
          description: 'AI-powered vendor discovery and booking platform.',
          tech_stack: ['FastAPI', 'Supabase', 'Next.js', 'n8n', 'JWT'],
          github_link: '#',
          live_link: '#',
          image: '/images/Event%20Mngt.jpeg',
          featured: false,
          is_visible: true
        },
        {
          id: '4',
          title: 'Healthcare SIH Backend Automation',
          description: 'Created back-end workflows for a healthcare prototype in automation. Designed pipelines using n8n for Smart India Hackathon.',
          tech_stack: ['n8n', 'Node.js', 'API Integration'],
          github_link: '#',
          live_link: '#',
          image: '/images/SIH%20back.jpeg',
          featured: true,
          is_visible: true
        }
      ],
      experience: [
        {
          id: '1',
          role: 'Microsoft Azure Intern',
          company: 'Microsoft Elevate & AICTE',
          description: 'Studied the fundamentals of cloud computing and Microsoft Azure services. Gained exposure to cloud deployment environments.',
          start_date: 'Jan 2026',
          end_date: 'Feb 2026'
        },
        {
          id: '2',
          role: 'Backend & Automation Team Member',
          company: 'Smart India Hackathon (SIH) 2025 – Grand Finale Finalist',
          description: 'Created back-end workflows for a healthcare prototype in automation. Designed automation pipelines for healthcare processes using n8n.',
          start_date: 'Dec 2025',
          end_date: 'Dec 2025'
        },
        {
          id: '3',
          role: 'AI & Data Analysis Intern',
          company: 'AICTE & Vodafone Idea Foundation (Edunet)',
          description: 'Performed data analysis on structured datasets to extract insights. Worked with AI-assisted automation and LLM-based workflows.',
          start_date: 'Sep 2025',
          end_date: 'Oct 2025'
        },
        {
          id: '4',
          role: 'B.Tech – Artificial Intelligence & Data Science',
          company: 'Dhanalakshmi Srinivasan Engineering College (Autonomous)',
          description: 'CGPA: 7.9. Focused on building AI-driven systems using Generative AI, LLMs, RAG, and Agentic AI.',
          start_date: '2023',
          end_date: '2027'
        },
        {
          id: '5',
          role: 'HSC & SSLC',
          company: 'AL - Mubeen Matriculation Higher Secondary School',
          description: 'HSC – 100% (All Pass) | SSLC – 75%',
          start_date: '2021',
          end_date: '2023'
        }
      ],
      achievements: [
        { id: '1', title: 'Smart India Hackathon (SIH) 2025 – Grand Finale Finalist', issuer: 'Ministry of Education, Government of India', year: '2025' },
        { id: '2', title: 'Microsoft Azure Internship Completion', issuer: 'Microsoft Elevate & AICTE', year: '2026' },
        { id: '3', title: 'NPTEL Programming in Java – Elite Certification', issuer: 'NPTEL', year: '2024' },
        { id: '4', title: 'SMVEC Hackathon Participant', issuer: 'Sri Manakula Vinayagar Engineering College', year: '2023' }
      ],
      contact: {
        id: '1',
        email: 'zeeshans0603@gmail.com',
        github: 'https://github.com/ZEESHAN0603',
        linkedin: 'https://linkedin.com/in/zeeshan-ahmed-ali-s-b14416290',
        phone: '+91 7200268996'
      }
    };
  }, []);

  const fetchAllData = async () => {
    // Check if Supabase is connected
    const isMock = import.meta.env.VITE_SUPABASE_URL === undefined || import.meta.env.VITE_SUPABASE_URL.includes('placeholder');
    if (isMock) {
      console.warn('Supabase keys are missing or placeholders. Using default static data.');
    }

    try {
      const [
        { data: settings, error: settingsError },
        { data: about, error: aboutError },
        { data: skills, error: skillsError },
        { data: projects, error: projectsError },
        { data: experience, error: experienceError },
        { data: achievements, error: achievementsError },
        { data: contact, error: contactError }
      ] = await Promise.all([
        supabase.from('settings').select('*').single(),
        supabase.from('about').select('*').single(),
        supabase.from('skills').select('*'),
        supabase.from('projects').select('*').order('id', { ascending: false }),
        supabase.from('experience').select('*').order('start_date', { ascending: false }),
        supabase.from('achievements').select('*').order('year', { ascending: false }),
        supabase.from('contact').select('*').single()
      ]);

      const finalProjects = (projects?.length ? projects : defaultData.projects).map(p => {
        const title = String(p.title || '').toLowerCase();
        let newImage = p.image;
        if (title.includes('cura')) newImage = '/images/Cura%20bot.jpeg';
        else if (title.includes('coach')) newImage = '/images/Zees%20coach.jpeg';
        else if (title.includes('event')) newImage = '/images/Event%20Mngt.jpeg';
        else if (title.includes('healthcare') || title.includes('sih')) newImage = '/images/SIH%20back.jpeg';

        return { ...p, image: newImage };
      });

      setData({
        settings: settings || defaultData.settings,
        about: about || defaultData.about,
        skills: skills?.length ? skills : defaultData.skills,
        projects: finalProjects,
        experience: experience?.length ? experience : defaultData.experience,
        achievements: achievements?.length ? achievements : defaultData.achievements,
        contact: contact || defaultData.contact
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      setData(defaultData);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [defaultData]);

  const handleAdminClick = () => {
    setAdminClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setIsAdminOpen(true);
        return 0;
      }
      return next;
    });
  };

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (data?.settings.site_title) {
      document.title = data.settings.site_title;
    }
  }, [data]);

  if (!data) return null;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AnimatedBackground />
      <div className="relative z-10 min-h-screen bg-transparent text-foreground selection:bg-emerald-500/30 selection:text-emerald-200">
        <GlowMenu />
        <SocialDock
          github={data.contact.github}
          linkedin={data.contact.linkedin}
          email={data.contact.email}
          resume={data.settings.resume_url}
        />

        <main>
          {/* Hero Section with Container Scroll */}
          <div id="home" className="relative z-10 w-full overflow-hidden bg-black/20">
            <ContainerScroll
              titleComponent={
                <div className="flex flex-col items-center gap-6 mb-10 overflow-visible">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-4 px-8 py-3 rounded-full glass-dark text-emerald-400 text-sm font-bold uppercase tracking-[0.4em] border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.1)] cursor-pointer"
                    onClick={handleAdminClick}
                  >
                    <Sparkles size={16} className="text-emerald-400" />
                    <span>Zeeshan Ahmed Ali S</span>
                  </motion.div>

                  <h1 className="text-4xl md:text-7xl lg:text-8xl font-display font-extrabold text-white tracking-tighter leading-none text-center drop-shadow-2xl">
                    {data.settings.hero_heading.split(' ').map((word, i) => (
                      <span key={i} className={i === 0 ? "block mb-2" : "text-emerald-400/90"}>
                        {word}{' '}
                      </span>
                    ))}
                  </h1>

                  <p className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-2xl font-medium leading-relaxed drop-shadow-md px-4">
                    {data.settings.hero_subtitle.split(',').map((part, i) => (
                      <span key={i} className={part.trim().toLowerCase().includes('ai') ? "text-emerald-400 font-bold" : ""}>
                        {part}{i < data.settings.hero_subtitle.split(',').length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </p>

                  <div className="flex items-center justify-center gap-6 mt-4">
                    <button 
                      onClick={() => handleDownload(data.settings.resume_url, 'Resume.pdf')}
                      className="px-8 py-4 rounded-xl bg-emerald-500 text-black font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                    >
                      Get Resume
                    </button>
                    <a 
                      href="#projects" 
                      className="px-8 py-4 rounded-xl glass-dark text-white font-bold border border-white/10 hover:bg-white/5 transition-all"
                    >
                      View Work
                    </a>
                  </div>
                </div>
              }
            >
              <img
                src="/images/starting.jpeg"
                alt="hero"
                className="w-full h-full object-cover rounded-2xl"
              />
            </ContainerScroll>
          </div>

          <AboutSection about={data.about} />

          <section id="skills" className="py-20 md:py-32 px-6">
            <SectionHeading subtitle="Technologies and tools I use to build AI systems, automation workflows, and scalable backend applications.">
              Core Expertise
            </SectionHeading>
            <IconCloudDemo
              iconSlugs={[
                ...data.skills.map(s => {
                  const name = s.skill_name.toLowerCase().trim();
                  if (name === 'generative ai' || name === 'generativeai') return 'googlecloud';
                  if (name === 'llms' || name === 'llm') return 'anthropic';
                  if (name === 'agentic ai' || name === 'agenticai') return 'langchain';
                  if (name === 'rest apis' || name === 'restapis' || name === 'api') return 'fastapi';
                  if (name === 'node.js' || name === 'nodejs') return 'nodedotjs';
                  if (name === 'sql') return 'postgresql';
                  if (name === 'visual studio code' || name === 'vscode') return 'visualstudiocode';
                  if (name === 'android studio') return 'androidstudio';
                  if (name === 'google colab') return 'googlecolab';
                  return name.replace(/\s+/g, '').replace(/\./g, 'dot');
                }),
                "python", "java", "javascript", "nodedotjs", "docker", "postgresql", "supabase", "n8n", "github", "visualstudiocode", "mysql", "googlecolab", "androidstudio"
              ]}
            />
          </section>

          <section id="projects" className="py-20 md:py-32 px-6 bg-muted/20 rounded-3xl mx-4 my-8">
            <SectionHeading subtitle="Featured intelligent systems and AI applications.">
              Selected Works
            </SectionHeading>

            {/* Desktop View: Grid Carousel */}
            <div className="hidden md:block">
              <ProjectCarousel projects={data.projects} />
            </div>

            {/* Mobile View: Animated Staggered Projects */}
            <div className="md:hidden">
              <ProjectStagger projects={data.projects} />
            </div>
          </section>

          <section id="experience" className="py-20 md:py-32 px-6">
            <div className="max-w-7xl mx-auto">
              <SectionHeading subtitle="My professional journey and certifications.">
                Journey & Milestones
              </SectionHeading>

              <div className="space-y-32">
                <ExperienceTimeline experience={data.experience} />

                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-12 text-center uppercase tracking-widest">Key Achievements</h3>
                  <AchievementCards achievements={data.achievements} />
                </div>
              </div>
            </div>
          </section>

          <ContactSection contact={data.contact} />
        </main>

        <footer className="py-20 px-6 border-t border-border text-center">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">{data.settings.site_title}</h2>
              <p className="text-muted-foreground text-sm mb-8">
                Designed and developed with precision. Powered by AI.
              </p>
              <div className="flex justify-center gap-8 text-muted-foreground text-xs uppercase tracking-widest font-bold">
                <a href="#home" className="hover:text-emerald-500 transition-colors">Home</a>
                <a href="#about" className="hover:text-emerald-500 transition-colors">About</a>
                <a href="#projects" className="hover:text-emerald-500 transition-colors">Projects</a>
              </div>
              <div className="mt-12 pt-12 border-t border-border text-muted-foreground text-[10px] uppercase tracking-[0.5em] flex items-center justify-center gap-4">
                <span>
                  © {new Date().getFullYear()} All Rights Reserved
                </span>
              </div>
            </div>
          </footer>

        <AnimatePresence>
          {isAdminOpen && (
            <AdminDashboard
              onClose={() => setIsAdminOpen(false)}
              onDataUpdate={fetchAllData}
              defaultData={defaultData}
            />
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}
