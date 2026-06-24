import { Search, Filter, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const SubjectPortalOverview = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container" style={{ padding: '64px 24px' }}>
      <header style={{ textAlign: 'center', marginBottom: '64px' }}>
         <h1 style={{ fontSize: '40px', marginBottom: '16px' }}>Computer Science Portal</h1>
         <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>Explore structured courses in programming, artificial intelligence, and software engineering.</p>
      </header>

      <div className="flex gap-4" style={{ marginBottom: '40px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
           <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
           <input className="input-field" style={{ paddingLeft: '44px' }} placeholder="Search for courses, topics, or instructors..." />
        </div>
        <button className="btn btn-secondary"><Filter size={18} /> Filters</button>
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
         {[1, 2, 3, 4, 5, 6].map(i => (
           <motion.div 
             variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
             whileHover={{ scale: 1.02 }}
             key={i} className="glass-panel" style={{ padding: '24px' }}>
               <div style={{ width: '48px', height: '48px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                 <BookOpen size={24} />
               </div>
               <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Data Structures & Algorithms {i}</h3>
               <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Master the core concepts of software engineering with hands-on algorithm design.</p>
               <div className="flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                 <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Instructor: Dr. Alan</span>
                 <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>View Details</button>
               </div>
           </motion.div>
         ))}
      </motion.div>
    </motion.div>
  );
};

export default SubjectPortalOverview;
