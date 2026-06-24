import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, BrainCircuit, CheckSquare, BarChart, 
  Book, Edit3, Award, ArrowRight, ChevronLeft, ChevronRight
} from 'lucide-react';
import './Landing.css'; // Import the new vanilla CSS

const Landing = () => {
  return (
    <div className="landing-page">
      
      {/* Navigation */}
      <nav className="landing-nav landing-container">
        <div className="nav-brand">
          <BookOpen size={24} strokeWidth={2.5} />
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
          <Link to="/login" className="btn-outline">Log In</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content landing-container">
          <div className="hero-text">
            <h1>Smart Learning for<br />Future Education</h1>
            <p>
              Elevate your university experience with EDUVERSE, the advanced AI-powered Learning Management System designed for next-generation academic success.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn-white">Get Started</Link>
              <Link to="/sandbox/subject-portal" className="btn-outline-white">Explore Courses</Link>
            </div>
          </div>

          <div className="hero-mockup">
            <div className="mockup-header">
              <div className="mockup-dot red"></div>
              <div className="mockup-dot yellow"></div>
              <div className="mockup-dot green"></div>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="mockup-line" style={{width: '80%'}}></div>
                <div className="mockup-line" style={{width: '60%'}}></div>
                <div className="mockup-line" style={{width: '90%'}}></div>
                <div className="mockup-line" style={{width: '70%', marginTop: '20px'}}></div>
              </div>
              <div className="mockup-main">
                <div className="mockup-line" style={{width: '40%', height: '12px', marginBottom: '8px'}}></div>
                <div style={{display: 'flex', gap: '16px', flex: 1}}>
                  <div className="mockup-box"></div>
                  <div className="mockup-box"></div>
                </div>
                <div style={{display: 'flex', gap: '16px', flex: 1}}>
                  <div className="mockup-box"></div>
                  <div className="mockup-box"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding landing-container">
        <h2 className="section-title">Premium AI-Powered Features</h2>
        
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">
              <BrainCircuit size={48} strokeWidth={1.5} />
            </div>
            <h3>AI Support</h3>
            <p>24/7 personalized learning assistance and query resolution powered by advanced AI.</p>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <CheckSquare size={48} strokeWidth={1.5} />
            </div>
            <h3>Smart Quizzes</h3>
            <p>Dynamic assessments that adapt to your learning pace and identify knowledge gaps.</p>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <BarChart size={48} strokeWidth={1.5} />
            </div>
            <h3>Progress Analytics</h3>
            <p>Real-time insights into student performance, attendance, and learning outcomes.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section-padding landing-container">
        <h2 className="section-title">How EDUVERSE Works</h2>
        
        <div className="how-it-works-grid">
          <div className="step-item">
             <p style={{marginBottom: '20px'}}>Engage with interactive course materials and AI-driven content.</p>
            <div className="step-circle">
              <Book size={32} strokeWidth={1.5} />
              <span>Learn</span>
            </div>
          </div>

          <div className="step-arrow">
            <ArrowRight size={24} strokeWidth={1.5} />
          </div>

          <div className="step-item">
            <p style={{marginBottom: '20px'}}>Reinforce knowledge through adaptive quizzes, assignments, and projects.</p>
            <div className="step-circle">
              <Edit3 size={32} strokeWidth={1.5} />
              <span>Practice</span>
            </div>
          </div>

          <div className="step-arrow">
            <ArrowRight size={24} strokeWidth={1.5} />
          </div>

          <div className="step-item">
            <p style={{marginBottom: '20px'}}>Track your growth with detailed feedback and achieve academic excellence.</p>
            <div className="step-circle">
              <Award size={32} strokeWidth={1.5} />
              <span>Improve</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section-padding testimonials-section">
        <div className="landing-container">
          <h2 className="section-title">What Partners Say</h2>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" />
                </div>
              </div>
              <p className="testimonial-content">
                EDUVERSE has revolutionized our teaching methods. The AI features are incredibly helpful for personalized student engagement.
              </p>
              <div className="testimonial-author">- Dr. A. Chen, Stanford University</div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img src="https://i.pravatar.cc/150?img=5" alt="Avatar" />
                </div>
              </div>
              <p className="testimonial-content">
                The analytics dashboard provides invaluable insights, allowing us to better support our student body.
              </p>
              <div className="testimonial-author">- M. Davis, MIT</div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="section-padding landing-container">
        <h2 className="section-title">Trusted by Leading Universities</h2>
        <div className="partners-row">
          <span className="partner-logo" style={{fontFamily: 'serif', color: '#8b0000'}}>Stanford University</span>
          <span className="partner-logo" style={{fontFamily: 'sans-serif', fontWeight: '900', letterSpacing: '-1px'}}>MIT</span>
          <span className="partner-logo" style={{color: '#003262', fontFamily: 'sans-serif'}}>UC Berkeley</span>
          <span className="partner-logo" style={{fontFamily: 'serif', fontStyle: 'italic', color: '#A51C30'}}>HARVARD</span>
          <span className="partner-logo" style={{fontFamily: 'sans-serif', fontWeight: '800'}}>ETH zürich</span>
          <span className="partner-logo" style={{fontFamily: 'serif', color: '#002147'}}>OXFORD</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="footer-grid landing-container">
          <div className="footer-brand">
            <div className="footer-brand-title">
              <BookOpen size={24} strokeWidth={2.5} />
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
