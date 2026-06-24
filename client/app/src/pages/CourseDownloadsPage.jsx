import { Download, FileText, Folder, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';

const CourseDownloadsPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container" style={{ padding: '64px 24px' }}>
       <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Course Materials & Downloads</h1>
       <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Access all datasets, PDFs, and slide decks for Advanced Machine Learning.</p>

       <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
         <div className="flex items-center gap-4">
            <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', borderRadius: '12px' }}>
               <HardDrive size={32} />
            </div>
            <div>
               <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>Complete Course Archive</h3>
               <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Download all materials as a single ZIP file for offline study. (1.2 GB)</p>
            </div>
            <button className="btn btn-primary" style={{ marginLeft: 'auto' }}><Download size={18} /> Download All</button>
         </div>
       </div>

       <h3 style={{ fontSize: '20px', marginBottom: '24px', marginTop: '48px' }}>Individual Files</h3>
       
       <motion.div 
         initial="hidden"
         animate="visible"
         variants={{
           hidden: { opacity: 0 },
           visible: {
             opacity: 1,
             transition: {
               staggerChildren: 0.1
             }
           }
         }}
         style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {[
            { icon: <FileText />, name: 'Syllabus.pdf', size: '2.4 MB' },
            { icon: <FileText />, name: 'Module_1_Slides.pdf', size: '15 MB' },
            { icon: <Folder />, name: 'Neural_Network_Dataset.zip', size: '450 MB' },
            { icon: <FileText />, name: 'Assignment_1_Instructions.pdf', size: '1.1 MB' },
          ].map((file, i) => (
             <motion.div 
               variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
               key={i} className="glass-panel flex items-center justify-between" style={{ padding: '24px' }}>
                <div className="flex items-center gap-4">
                  <div style={{ color: 'var(--text-muted)' }}>{file.icon}</div>
                  <div>
                    <div style={{ fontWeight: 500 }}>{file.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{file.size}</div>
                  </div>
                </div>
                <button className="btn btn-secondary" style={{ padding: '8px 12px' }}><Download size={16} /></button>
             </motion.div>
          ))}
       </motion.div>
    </motion.div>
  );
};

export default CourseDownloadsPage;
