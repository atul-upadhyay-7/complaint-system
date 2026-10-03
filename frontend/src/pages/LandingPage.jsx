import FadeContent from '@/components/reactbits/FadeContent';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stagger, Item, MLink, EASE } from '@/lib/motion';
import { ArrowUpRight, Check, GraduationCap, MapPin, MessageSquare, ShieldCheck, Clock, Wrench, ArrowRight } from 'lucide-react';

const steps = [
    { icon: MessageSquare, title: 'Tell us what happened', text: 'Add a description, location and photo. Local AI suggests a category and priority.' },
    { icon: Wrench, title: 'The right team takes over', text: 'Wardens and administrators assign the issue to a technician and update its status.' },
    { icon: Check, title: 'Stay in the loop', text: 'Follow the resolution timeline and receive notifications when something changes.' },
];

export default function LandingPage() {
    return (
        <div className="landing">
            <nav className="landing-nav" aria-label="Main navigation">
                <Link className="brand" to="/" aria-label="Uniissuehub home"><GraduationCap size={26} />Uniissuehub</Link>
                <div className="landing-nav-actions"><a href="#how-it-works">How it works</a><Link to="/login">Sign in <ArrowUpRight size={16} /></Link></div>
            </nav>
            <main>
                <section className="landing-hero">
                    <Stagger className="hero-copy">
                        <Item as="p" className="eyebrow"><span /> A better way to care for your campus</Item>
                        <Item as="h1">Small issues.<br /><span>Real attention.</span></Item>
                        <Item as="p" className="hero-description">The broken tap. The unreliable Wi-Fi. The light that never got fixed. Give every campus issue a place to be heard, tracked and resolved.</Item>
                        <Item className="hero-actions"><MLink className="primary-link" to="/register" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>Report an issue <ArrowRight size={18} /></MLink><MLink className="secondary-link" to="/login" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>Open your dashboard <ArrowUpRight size={18} /></MLink></Item>
                        <Item as="p" className="hero-note"><ShieldCheck size={16} /> One place for students, wardens and campus teams.</Item>
                    </Stagger>
                    <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: EASE, delay: 0.15 }} whileHover={{ y: -4 }} className="issue-preview" aria-label="Illustrative complaint progress, not live data">
                        <div className="preview-header"><span>THE CAMPUS ISSUE BOARD</span><span className="preview-example">Example</span></div>
                        <div className="preview-ticket"><span className="ticket-category"><Wrench size={16} /> Maintenance</span><span className="ticket-status">In progress</span></div>
                        <h2>A tap that won't stop leaking.</h2>
                        <p className="preview-location"><MapPin size={15} /> Block A · Second floor washroom</p>
                        <Stagger className="preview-timeline">
                            <Item><span className="step-dot done"><Check size={13} /></span><section><strong>Issue reported</strong><p>Description and location received</p></section></Item>
                            <Item><span className="step-dot done"><Check size={13} /></span><section><strong>Assigned to maintenance</strong><p>The right team has your report</p></section></Item>
                            <Item><span className="step-dot current"><Clock size={13} /></span><section><strong>Repair in progress</strong><p>You can follow every update here</p></section></Item>
                        </Stagger>
                        <div className="preview-footer"><span className="team-avatar">M</span><div><strong>Campus maintenance</strong><span>Working on this issue</span></div><MessageSquare size={20} /></div>
                    </motion.div>
                </section>
                <div className="landing-divider"><span>Less chasing updates.</span><span>More getting things fixed.</span><span>A campus that listens.</span></div>
                <section className="how-section" id="how-it-works">
                    <div className="section-heading"><p className="eyebrow">FROM REPORT TO RESOLUTION</p><h2>A clear next step.<br />At every step.</h2><p>No scattered messages or wondering who to ask. Your report stays in one place from the first description to the final update.</p></div>
                    <FadeContent blur duration={900}><div className="steps-grid">{steps.map(({icon: Icon, title, text}, i) => <motion.article key={title} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 28 }}><span className="step-number">0{i + 1}</span><Icon size={25} /><h3>{title}</h3><p>{text}</p></motion.article>)}</div></FadeContent>
                </section>
                <FadeContent blur duration={900}><section className="landing-cta"><div><p className="eyebrow">YOUR CAMPUS. YOUR VOICE.</p><h2>Something needs fixing?</h2><p>Start with a report. Keep track of what happens next.</p></div><Link className="primary-link" to="/register">Create an account <ArrowRight size={18} /></Link></section></FadeContent>
            </main>
            <footer className="landing-footer"><Link className="brand" to="/"><GraduationCap size={22} />Uniissuehub</Link><p>Campus complaint management, with people at the centre.</p><Link to="/login">Sign in <ArrowUpRight size={15} /></Link></footer>
        </div>
    );
}
