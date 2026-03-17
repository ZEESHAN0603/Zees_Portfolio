import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Save, LogIn, LogOut, Settings as SettingsIcon, Menu, X } from 'lucide-react';
import { supabase } from './lib/supabase';
import { cn } from './lib/utils';

export const AdminDashboard = ({ onClose, onDataUpdate, defaultData }: { onClose: () => void; onDataUpdate?: () => void; defaultData?: any }) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'about' | 'skills' | 'projects' | 'experience' | 'achievements' | 'contact' | 'resume' | 'setup'>('projects');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const fetchData = async () => {
    if (activeTab === 'setup') return;
    setLoading(true);
    try {
      const table = activeTab === 'resume' ? 'settings' : activeTab;
      const { data: result, error } = await supabase.from(table).select('*');
      if (error) {
        console.error('Fetch error:', error);
        if (error.code === '42P01') {
          alert(`Table "${table}" does not exist. Please go to the "Setup" tab to create it.`);
        }
      }
      setData(result || []);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    if (!defaultData) return;
    setLoading(true);
    try {
      const seedData = defaultData[activeTab];
      if (Array.isArray(seedData)) {
        // For arrays, we might want to filter out existing ones or just insert all
        // To keep it simple, we insert all if the current data is empty
        if (data.length === 0) {
          await supabase.from(activeTab).insert(seedData.map(({ id, ...rest }: any) => rest));
        } else {
          alert('Data already exists in this table. Seeding skipped to avoid duplicates.');
        }
      } else if (seedData) {
        // For single objects (settings, about, contact)
        if (data.length === 0) {
          const { id, ...rest } = seedData;
          await supabase.from(activeTab).insert([rest]);
        } else {
          alert('Data already exists in this table.');
        }
      }
      fetchData();
      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      console.error('Error seeding data:', error);
      alert('Error seeding data. Check console.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [activeTab, isAuthenticated]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      const table = activeTab === 'resume' ? 'settings' : activeTab;
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) {
        alert(`Error deleting: ${error.message}`);
      } else {
        fetchData();
        if (onDataUpdate) onDataUpdate();
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const payload: any = Object.fromEntries(formData.entries());
      const table = activeTab === 'resume' ? 'settings' : activeTab;
      
      // Handle boolean and array types
      if (activeTab === 'projects') {
        payload.featured = payload.featured === 'on';
        payload.is_visible = payload.is_visible === 'on';
        if (payload.tech_stack) {
          payload.tech_stack = payload.tech_stack.split(',').map((t: string) => t.trim());
        }
      }

      let error;
      if (editingItem?.id) {
        const { error: err } = await supabase.from(table).update(payload).eq('id', editingItem.id);
        error = err;
      } else {
        const { error: err } = await supabase.from(table).insert([payload]);
        error = err;
      }

      if (error) {
        alert(`Error saving: ${error.message}`);
      } else {
        setEditingItem(null);
        fetchData();
        if (onDataUpdate) onDataUpdate();
      }
    } catch (err: any) {
      alert(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-6">
        <div className="glass p-8 rounded-3xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-6">CMS Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter password" 
              className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-emerald-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full bg-emerald-500 text-zinc-950 font-bold py-3 rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2">
              <LogIn size={20} />
              Login
            </button>
            <button type="button" onClick={onClose} className="w-full text-zinc-500 text-sm hover:text-white transition-colors">
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      <header className="p-4 md:p-6 border-b border-border flex items-center justify-between bg-background/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 text-zinc-500 hover:text-emerald-400 transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0">
            <SettingsIcon size={20} className="md:w-6 md:h-6" />
          </div>
          <div className="overflow-hidden">
            <h2 className="text-lg md:text-xl font-bold text-foreground truncate">Portfolio CMS</h2>
            <p className="hidden xs:block text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Admin Control Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all text-sm font-medium"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        <aside className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-background border-r border-border p-4 flex flex-col gap-2 transition-transform duration-300 md:relative md:translate-x-0 md:z-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between md:hidden mb-6">
            <h3 className="font-bold text-foreground">Navigation</h3>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-zinc-500 hover:text-white">
              <X size={20} />
            </button>
          </div>
          {(['settings', 'about', 'skills', 'projects', 'experience', 'achievements', 'contact', 'resume', 'setup'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl transition-colors capitalize",
                activeTab === tab ? "bg-emerald-500/10 text-emerald-400 font-bold" : "text-muted-foreground hover:bg-muted",
                tab === 'setup' && "mt-auto border-t border-border pt-4"
              )}
            >
              {tab === 'setup' ? 'Database Setup' : tab}
            </button>
          ))}
        </aside>

        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-20 bg-black/50 md:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-grow overflow-y-auto p-8">
          {activeTab === 'setup' ? (
            <div className="max-w-3xl">
              <h3 className="text-2xl font-bold text-foreground mb-4">Supabase Database Setup</h3>
              <p className="text-muted-foreground mb-6">
                To store your data in Supabase, you must create the necessary tables. 
                Copy the SQL below and run it in your Supabase SQL Editor.
              </p>
              <div className="bg-zinc-950 p-6 rounded-2xl overflow-x-auto border border-border mb-8">
                <pre className="text-emerald-500 text-sm font-mono">
{`-- Run this in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS settings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  site_title TEXT NOT NULL,
  hero_heading TEXT NOT NULL,
  hero_subtitle TEXT,
  hero_cta_text TEXT,
  resume_url TEXT
);

CREATE TABLE IF NOT EXISTS about (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  profile_image TEXT
);

CREATE TABLE IF NOT EXISTS skills (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  skill_name TEXT NOT NULL,
  category TEXT,
  icon TEXT
);

CREATE TABLE IF NOT EXISTS projects (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT[],
  github_link TEXT,
  live_link TEXT,
  image TEXT,
  featured BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS experience (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT,
  start_date TEXT,
  end_date TEXT
);

CREATE TABLE IF NOT EXISTS achievements (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  issuer TEXT,
  year TEXT,
  certificate_url TEXT
);

CREATE TABLE IF NOT EXISTS contact (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email TEXT NOT NULL,
  github TEXT,
  linkedin TEXT,
  phone TEXT
);

-- Enable Public Access (Simplified for Demo)
-- WARNING: In production, use proper RLS policies
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access" ON settings FOR ALL USING (true);
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access" ON about FOR ALL USING (true);
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access" ON skills FOR ALL USING (true);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access" ON projects FOR ALL USING (true);
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access" ON experience FOR ALL USING (true);
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access" ON achievements FOR ALL USING (true);
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access" ON contact FOR ALL USING (true);

-- ADD MISSING COLUMNS (Run if tables already exist)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS hero_cta_text TEXT;
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS certificate_url TEXT;`}
                </pre>
              </div>
              <div className="glass p-6 rounded-2xl border-emerald-500/20">
                <h4 className="font-bold text-foreground mb-2">After running SQL:</h4>
                <ol className="list-decimal list-inside text-muted-foreground space-y-2 text-xs md:text-sm">
                  <li>Go back to the other tabs (Projects, Skills, etc.)</li>
                  <li>Click "Seed with Default Data" to populate with initial content</li>
                  <li>Your portfolio will now be synced with Supabase!</li>
                </ol>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex flex-wrap items-center gap-4">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground capitalize">{activeTab}</h3>
                  {data.length === 0 && defaultData && activeTab !== 'resume' && (
                    <button 
                      onClick={handleSeed}
                      className="text-[10px] md:text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full hover:bg-emerald-500/20 transition-colors"
                    >
                      Seed Default Data
                    </button>
                  )}
                </div>
                {activeTab !== 'resume' && (
                  <button 
                    onClick={() => setEditingItem({})} 
                    className="w-full sm:w-auto bg-emerald-500 text-zinc-950 font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors"
                  >
                    <Plus size={20} />
                    Add New
                  </button>
                )}
              </div>

              {loading ? (
                <div className="text-zinc-500">Loading...</div>
              ) : (
                <div className="grid gap-4 overflow-x-auto pb-4">
                  {activeTab === 'resume' ? (
                    data.length > 0 ? (
                      <div className="glass p-6 md:p-8 rounded-3xl border-emerald-500/20 shadow-2xl min-w-[300px]">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 mb-8">
                          <div>
                            <h4 className="font-bold text-foreground text-xl md:text-2xl mb-2">Resume Management</h4>
                            <p className="text-muted-foreground text-xs md:text-sm">Manage your downloadable resume link. This link is used across the entire portfolio.</p>
                          </div>
                          <button onClick={() => setEditingItem(data[0])} className="bg-emerald-500 text-zinc-950 px-6 py-3 rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 font-bold w-full md:w-auto">
                            <Edit2 size={18} />
                            Update Resume
                          </button>
                        </div>
                        <div className="bg-zinc-950/50 p-4 md:p-6 rounded-2xl border border-border">
                          <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase font-bold mb-2 tracking-widest">Current Resume URL</p>
                          <p className="text-emerald-400 font-mono break-all text-sm md:text-lg">{data[0].resume_url || 'No URL set'}</p>
                        </div>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                            <p className="font-bold text-foreground mb-1 text-sm md:text-base">Hero Section</p>
                            <p className="text-[10px] md:text-xs text-muted-foreground">The "Download Resume" button in your hero section will point to this URL.</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                            <p className="font-bold text-foreground mb-1 text-sm md:text-base">Social Dock</p>
                            <p className="text-[10px] md:text-xs text-muted-foreground">The resume icon in your bottom social dock will point to this URL.</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl bg-muted/5">
                        <p className="text-muted-foreground mb-4">Please configure your "Settings" first to manage the resume.</p>
                        <button 
                          onClick={() => setActiveTab('settings')}
                          className="text-emerald-500 hover:underline font-bold"
                        >
                          Go to Settings
                        </button>
                      </div>
                    )
                  ) : (
                    <>
                      {data.map((item) => (
                        <div key={item.id} className="glass p-4 rounded-2xl flex items-center justify-between group min-w-[300px]">
                          <div className="overflow-hidden mr-4">
                            <h4 className="font-bold text-foreground truncate">{item.title || item.skill_name || item.role || item.site_title || item.email}</h4>
                            <p className="text-muted-foreground text-xs md:text-sm truncate">{item.description || item.company || item.category || item.hero_heading}</p>
                          </div>
                          <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
                            <button onClick={() => setEditingItem(item)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground">
                              <Edit2 size={18} />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-red-400">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {data.length === 0 && (
                        <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl w-full">
                          <p className="text-muted-foreground">No data found in this table.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <AnimatePresence>
        {editingItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setEditingItem(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="glass p-8 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">{editingItem.id ? 'Edit' : 'Add'} {activeTab}</h3>
                <button 
                  onClick={() => setEditingItem(null)}
                  className="p-2 text-zinc-500 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                {activeTab === 'resume' && (
                  <>
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl mb-4">
                      <p className="text-sm text-emerald-400">
                        <strong>Note:</strong> The resume link is part of your general site settings. 
                        Updating it here will update the download link in the Hero section and Social Dock.
                      </p>
                    </div>
                    <input name="resume_url" defaultValue={editingItem.resume_url} placeholder="Resume URL (e.g., https://example.com/resume.pdf)" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" required />
                    
                    {/* Hidden fields to preserve other settings when saving from Resume tab */}
                    <input type="hidden" name="site_title" defaultValue={editingItem.site_title} />
                    <input type="hidden" name="hero_heading" defaultValue={editingItem.hero_heading} />
                    <input type="hidden" name="hero_subtitle" defaultValue={editingItem.hero_subtitle} />
                    <input type="hidden" name="hero_cta_text" defaultValue={editingItem.hero_cta_text} />
                  </>
                )}
                {activeTab === 'settings' && (
                  <>
                    <input name="site_title" defaultValue={editingItem.site_title} placeholder="Site Title" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" required />
                    <input name="hero_heading" defaultValue={editingItem.hero_heading} placeholder="Hero Heading" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" required />
                    <input name="hero_subtitle" defaultValue={editingItem.hero_subtitle} placeholder="Hero Subtitle" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" />
                    <input name="hero_cta_text" defaultValue={editingItem.hero_cta_text} placeholder="Hero CTA Text" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" />
                    <input name="resume_url" defaultValue={editingItem.resume_url} placeholder="Resume URL" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" />
                  </>
                )}
                {activeTab === 'about' && (
                  <>
                    <input name="title" defaultValue={editingItem.title} placeholder="Title" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" required />
                    <textarea name="description" defaultValue={editingItem.description} placeholder="Description" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground h-32" required />
                    <input name="profile_image" defaultValue={editingItem.profile_image} placeholder="Profile Image URL" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" />
                  </>
                )}
                {activeTab === 'skills' && (
                  <>
                    <input name="skill_name" defaultValue={editingItem.skill_name} placeholder="Skill Name" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" required />
                    <input name="category" defaultValue={editingItem.category} placeholder="Category" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" />
                    <input name="icon" defaultValue={editingItem.icon} placeholder="Icon Name (Lucide)" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" />
                  </>
                )}
                {activeTab === 'projects' && (
                  <>
                    <input name="title" defaultValue={editingItem.title} placeholder="Title" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" required />
                    <textarea name="description" defaultValue={editingItem.description} placeholder="Description" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground h-32" required />
                    <input name="tech_stack" defaultValue={editingItem.tech_stack?.join(', ')} placeholder="Tech Stack (comma separated)" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" />
                    <input name="github_link" defaultValue={editingItem.github_link} placeholder="GitHub Link" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" />
                    <input name="live_link" defaultValue={editingItem.live_link} placeholder="Live Link" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" />
                    <input name="image" defaultValue={editingItem.image} placeholder="Image URL" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" />
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-foreground">
                        <input type="checkbox" name="featured" defaultChecked={editingItem.featured} /> Featured
                      </label>
                      <label className="flex items-center gap-2 text-foreground">
                        <input type="checkbox" name="is_visible" defaultChecked={editingItem.is_visible} /> Visible
                      </label>
                    </div>
                  </>
                )}
                {activeTab === 'experience' && (
                  <>
                    <input name="role" defaultValue={editingItem.role} placeholder="Role" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" required />
                    <input name="company" defaultValue={editingItem.company} placeholder="Company" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" required />
                    <textarea name="description" defaultValue={editingItem.description} placeholder="Description" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground h-32" />
                    <div className="grid grid-cols-2 gap-4">
                      <input name="start_date" defaultValue={editingItem.start_date} placeholder="Start Date" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" />
                      <input name="end_date" defaultValue={editingItem.end_date} placeholder="End Date" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" />
                    </div>
                  </>
                )}
                {activeTab === 'achievements' && (
                  <>
                    <input name="title" defaultValue={editingItem.title} placeholder="Title" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" required />
                    <input name="issuer" defaultValue={editingItem.issuer} placeholder="Issuer" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" />
                    <input name="year" defaultValue={editingItem.year} placeholder="Year" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" />
                    <input name="certificate_url" defaultValue={editingItem.certificate_url} placeholder="Certificate URL (Link to image, PDF, or Google Drive)" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" />
                  </>
                )}
                {activeTab === 'contact' && (
                  <>
                    <input name="email" defaultValue={editingItem.email} placeholder="Email" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" required />
                    <input name="github" defaultValue={editingItem.github} placeholder="GitHub URL" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" />
                    <input name="linkedin" defaultValue={editingItem.linkedin} placeholder="LinkedIn URL" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" />
                    <input name="phone" defaultValue={editingItem.phone} placeholder="Phone" className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground" />
                  </>
                )}

                <button className="w-full bg-emerald-500 text-zinc-950 font-bold py-4 rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2">
                  <Save size={20} />
                  Save Changes
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
