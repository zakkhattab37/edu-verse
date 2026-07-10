import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// Flaticon is used via CDN in index.html
import './Landing.css';

// Framer motion variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Landing = () => {
  return (
    <div className="landing-page">
      
      {/* Navigation */}
      <motion.nav 
        className="landing-nav landing-container"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="nav-brand">
          <i className="fi fi-rr-book-open-cover" style={{ fontSize: '24px', color: '#0d5dd6' }}></i>
          <span>EDUVERSE</span>
        </div>
        
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it Works</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#partners">Partners</a>
          <a href="#resources">Resources</a>
        </div>
        
        <div className="nav-actions">
          <Link to="/login" className="uv-btn-outline">Log In</Link>
          <Link to="/register" className="uv-btn-primary">Get Started</Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content landing-container">
          <motion.div 
            className="hero-text"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={fadeIn}>Smart Learning for<br /><span className="text-gradient">Future Education</span></motion.h1>
            <motion.p variants={fadeIn}>
              Elevate your university experience with EDUVERSE, the advanced AI-powered Learning Management System designed for next-generation academic success.
            </motion.p>
            <motion.div className="hero-actions" variants={fadeIn}>
              <Link to="/register" className="uv-btn-primary">Get Started</Link>
              <Link to="/subject-portal" className="uv-btn-outline">Explore Courses</Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-mockup"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
          >
            <div className="mockup-header">
              <div className="mockup-dot red"></div>
              <div className="mockup-dot yellow"></div>
              <div className="mockup-dot green"></div>
              <div className="mockup-search">
                <i className="fi fi-rr-search"></i>
                <span>Search courses...</span>
              </div>
              <div className="mockup-user">
                <div className="mockup-avatar"></div>
              </div>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="mockup-nav-item active"><i className="fi fi-rr-apps"></i></div>
                <div className="mockup-nav-item"><i className="fi fi-rr-book-alt"></i></div>
                <div className="mockup-nav-item"><i className="fi fi-rr-chart-pie-alt"></i></div>
                <div className="mockup-nav-item"><i className="fi fi-rr-envelope"></i></div>
              </div>
              <div className="mockup-main">
                <div className="mockup-title">
                  <h4>Welcome back, John!</h4>
                  <p>You have 2 pending assignments.</p>
                </div>
                <div className="mockup-stats-row">
                  <div className="mockup-stat-card primary">
                    <span className="stat-value">85%</span>
                    <span className="stat-label">Average Score</span>
                  </div>
                  <div className="mockup-stat-card secondary">
                    <span className="stat-value">12</span>
                    <span className="stat-label">Courses</span>
                  </div>
                </div>
                <div className="mockup-courses-row">
                  <div className="mockup-course-card">
                    <div className="course-thumb ml">
                      <i className="fi fi-rr-brain"></i>
                    </div>
                    <h5>Machine Learning</h5>
                    <div className="course-progress">
                      <div className="progress-bar" style={{width: '70%'}}></div>
                    </div>
                  </div>
                  <div className="mockup-course-card">
                    <div className="course-thumb ds">
                      <i className="fi fi-rr-chart-histogram"></i>
                    </div>
                    <h5>Data Science</h5>
                    <div className="course-progress">
                      <div className="progress-bar" style={{width: '45%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding landing-container">
        <motion.h2 
          className="section-title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={fadeIn}
        >
          Premium AI-Powered Features
        </motion.h2>
        
        <motion.div 
          className="features-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div 
            className="feature-item" 
            variants={fadeIn}
            whileHover={{ y: -10 }}
          >
            <div className="feature-icon">
              <i className="fi fi-rr-microchip" style={{ fontSize: '48px' }}></i>
            </div>
            <h3>AI Support</h3>
            <p>24/7 personalized learning assistance and query resolution powered by advanced AI.</p>
          </motion.div>

          <motion.div 
            className="feature-item" 
            variants={fadeIn}
            whileHover={{ y: -10 }}
          >
            <div className="feature-icon">
              <i className="fi fi-rr-checkbox" style={{ fontSize: '48px' }}></i>
            </div>
            <h3>Smart Quizzes</h3>
            <p>Dynamic assessments that adapt to your learning pace and identify knowledge gaps.</p>
          </motion.div>

          <motion.div 
            className="feature-item" 
            variants={fadeIn}
            whileHover={{ y: -10 }}
          >
            <div className="feature-icon">
              <i className="fi fi-rr-stats" style={{ fontSize: '48px' }}></i>
            </div>
            <h3>Progress Analytics</h3>
            <p>Real-time insights into student performance, attendance, and learning outcomes.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section-padding landing-container" style={{ position: 'relative' }}>
        <div className="how-it-works-glow"></div>
        <motion.h2 
          className="section-title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={fadeIn}
        >
          How EDUVERSE Works
        </motion.h2>
        
        <motion.div 
          className="how-it-works-modern-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className="modern-step-card" variants={fadeIn} whileHover={{ y: -10 }}>
            <div className="step-number">01</div>
            <div className="step-icon-wrapper">
              <i className="fi fi-rr-book-alt" style={{ fontSize: '28px' }}></i>
            </div>
            <h3 className="step-title">Learn</h3>
            <p className="step-desc">Engage with interactive course materials and AI-driven content tailored to your unique learning style.</p>
          </motion.div>

          <motion.div className="modern-step-card" variants={fadeIn} whileHover={{ y: -10 }}>
            <div className="step-number">02</div>
            <div className="step-icon-wrapper">
              <i className="fi fi-rr-edit" style={{ fontSize: '28px' }}></i>
            </div>
            <h3 className="step-title">Practice</h3>
            <p className="step-desc">Reinforce knowledge seamlessly through adaptive quizzes, assignments, and hands-on projects.</p>
          </motion.div>

          <motion.div className="modern-step-card" variants={fadeIn} whileHover={{ y: -10 }}>
            <div className="step-number">03</div>
            <div className="step-icon-wrapper">
              <i className="fi fi-rr-award" style={{ fontSize: '28px' }}></i>
            </div>
            <h3 className="step-title">Improve</h3>
            <p className="step-desc">Track your continuous growth with detailed analytics and achieve true academic excellence.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section-padding testimonials-section">
        <div className="landing-container">
          <motion.h2 
            className="section-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            variants={fadeIn}
          >
            What Partners Say
          </motion.h2>
          
          <motion.div 
            className="testimonials-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div 
              className="testimonial-card" 
              variants={fadeIn}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" />
                </div>
              </div>
              <p className="testimonial-content">
                EDUVERSE has revolutionized our teaching methods. The AI features are incredibly helpful for personalized student engagement.
              </p>
              <div className="testimonial-author">- Dr. A. Chen, Stanford University</div>
            </motion.div>

            <motion.div 
              className="testimonial-card" 
              variants={fadeIn}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img src="https://i.pravatar.cc/150?img=5" alt="Avatar" />
                </div>
              </div>
              <p className="testimonial-content">
                The analytics dashboard provides invaluable insights, allowing us to better support our student body.
              </p>
              <div className="testimonial-author">- M. Davis, MIT</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="section-padding landing-container" style={{ overflow: 'hidden' }}>
        <motion.h2 
          className="section-title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={fadeIn}
        >
          Trusted by Leading Universities
        </motion.h2>
        <div className="partners-container">
          <motion.div 
            className="partners-row"
            animate={{ x: [0, "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 25
            }}
          >
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="partner-logo" style={{fontFamily: 'serif', color: '#8b0000'}}>Stanford University</span>
                <span className="partner-logo" style={{fontFamily: 'sans-serif', fontWeight: '900', letterSpacing: '-1px'}}>MIT</span>
                <span className="partner-logo" style={{color: '#003262', fontFamily: 'sans-serif'}}>UC Berkeley</span>
                <span className="partner-logo" style={{fontFamily: 'serif', fontStyle: 'italic', color: '#A51C30'}}>HARVARD</span>
                <span className="partner-logo" style={{fontFamily: 'sans-serif', fontWeight: '800'}}>ETH zürich</span>
                <span className="partner-logo" style={{fontFamily: 'serif', color: '#002147'}}>OXFORD</span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="footer-grid landing-container">
          <div className="footer-brand">
            <div className="footer-brand-title">
              <i className="fi fi-rr-book-open-cover" style={{ fontSize: '24px', color: '#0d5dd6' }}></i>
              <span>EDUVERSE</span>
            </div>
            <p>To premium AI-powered university LME platform.</p>
            <div className="footer-socials">
              <span style={{cursor: 'pointer'}}>Twitter</span>
              <span style={{cursor: 'pointer'}}>LinkedIn</span>
              <span style={{cursor: 'pointer'}}>Facebook</span>
            </div>
          </div>
          
          <div className="footer-links-container">
            <div className="footer-column">
              <h4>Platform</h4>
              <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">Solutions</a></li>
                <li><a href="#">Pricing</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Documentation</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
