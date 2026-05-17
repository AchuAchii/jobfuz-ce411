import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import Layout from './components/Layout';
import Hero from './components/Hero';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
import CTAStrip from './components/CTAStrip';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ContactSection from './components/ContactSection';
import ProfessionModal from './components/ProfessionModal';
import ProtectedRoute from './components/ProtectedRoute';
import { LogoMark } from './components/Brand';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { auth } from './services/auth';
import { fetchUserProfession, saveUserProfession } from './services/profileService';

const Dashboard = lazy(() => import('./components/Dashboard'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const ResumePage = lazy(() => import('./pages/ResumePage'));
const MCQPage = lazy(() => import('./pages/MCQPage'));
const EssayPage = lazy(() => import('./pages/EssayPage'));
const WorkStylePage = lazy(() => import('./pages/WorkStylePage'));
const InterviewPage = lazy(() => import('./pages/InterviewPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));

function AppLoader({ label = 'Loading...' }) {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgb(var(--bg))' }}>
            <div
                className="flex flex-col items-center gap-4 rounded-[28px] border px-8 py-9"
                style={{
                    background: 'rgb(var(--surface-elevated) / 0.8)',
                    borderColor: 'rgb(var(--border))',
                    boxShadow: 'var(--shadow-panel)',
                }}
            >
                <div className="flex h-14 w-14 items-center justify-center rounded-[20px]" style={{ background: 'rgb(var(--surface2))' }}>
                    <LogoMark size={38} className="animate-pulse" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'rgb(var(--subtle))' }}>
                    {label}
                </span>
                <div className="h-1 w-20 overflow-hidden rounded-full" style={{ background: 'rgb(var(--surface3))' }}>
                    <Motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, repeatType: 'loop', duration: 1.2, ease: 'linear' }}
                        className="h-full w-1/2 rounded-full"
                        style={{ background: 'linear-gradient(90deg, transparent 0%, rgb(var(--brand)) 50%, transparent 100%)' }}
                    />
                </div>
            </div>
        </div>
    );
}

function SnapSection({ id, children, className = '', onInView, hero = false }) {
    const ref = useRef(null);

    useEffect(() => {
        if (!onInView) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) onInView();
            },
            { threshold: 0.5 },
        );

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, [onInView]);

    return (
        <div
            id={id}
            ref={ref}
            className={`snap-section${hero ? ' snap-hero' : ''} ${className}`}
        >
            {children}
        </div>
    );
}

const LandingPage = ({ setActiveSection }) => (
    <Motion.main key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <SnapSection id="hero" hero onInView={() => setActiveSection(0)}>
            <Hero />
        </SnapSection>

        <SnapSection id="features" onInView={() => setActiveSection(1)}>
            <div className="landing-shell w-full max-w-6xl mx-auto px-4 sm:px-6">
                <FeaturesSection />
            </div>
        </SnapSection>

        <SnapSection id="how-it-works" onInView={() => setActiveSection(2)}>
            <div className="landing-shell w-full max-w-6xl mx-auto px-4 sm:px-6">
                <HowItWorks />
            </div>
        </SnapSection>

        <SnapSection id="benefits" onInView={() => setActiveSection(3)}>
            <div className="landing-shell w-full max-w-6xl mx-auto px-4 sm:px-6">
                <Benefits />
            </div>
        </SnapSection>

        <SnapSection id="testimonials" onInView={() => setActiveSection(4)}>
            <div className="landing-shell w-full max-w-6xl mx-auto px-4 sm:px-6">
                <Testimonials />
            </div>
        </SnapSection>

        <SnapSection id="faq" onInView={() => setActiveSection(5)}>
            <div className="landing-shell w-full max-w-5xl mx-auto px-4 sm:px-6">
                <FAQ />
            </div>
        </SnapSection>

        <SnapSection id="cta" onInView={() => setActiveSection(6)} className="relative overflow-hidden">
            <div className="landing-shell w-full max-w-5xl mx-auto px-4 sm:px-6">
                <CTAStrip />
            </div>
        </SnapSection>

        <SnapSection id="contact" onInView={() => setActiveSection(7)} className="relative">
            <div className="landing-shell landing-shell-contact w-full">
                <div className="landing-contact-body w-full">
                    <ContactSection embedded />
                </div>
                <Footer />
            </div>
        </SnapSection>
    </Motion.main>
);

const AppContent = () => {
    const [activeSection, setActiveSection] = useState(0);
    const [optimisticUser, setOptimisticUser] = useState(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [profession, setProfession] = useState(null);
    const [professionHydrated, setProfessionHydrated] = useState(false);
    const [isProfessionModalOpen, setIsProfessionModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const { user, loading } = useAuth();

    const effectiveUser = isLoggingOut ? null : (user || optimisticUser);
    const isLanding = location.pathname === '/';

    useEffect(() => {
        if (user) setOptimisticUser(null);
    }, [user]);

    useEffect(() => {
        const html = document.documentElement;
        if (isLanding) {
            html.classList.add('landing-snap');
        } else {
            html.classList.remove('landing-snap');
        }
        return () => html.classList.remove('landing-snap');
    }, [isLanding]);

    useEffect(() => {
        if (!effectiveUser?.id) {
            setProfession(null);
            setProfessionHydrated(true);
            return undefined;
        }

        let cancelled = false;
        setProfessionHydrated(false);

        (async () => {
            const nextProfession = await fetchUserProfession(effectiveUser.id);
            if (cancelled) return;
            setProfession(nextProfession);
            setProfessionHydrated(true);
        })();

        return () => {
            cancelled = true;
        };
    }, [effectiveUser?.id]);

    useEffect(() => {
        if (!effectiveUser) {
            setIsProfessionModalOpen(false);
            return;
        }
        if (!professionHydrated) return;
        setIsProfessionModalOpen(!profession);
    }, [effectiveUser, profession, professionHydrated]);

    const showToast = (message) => setToastMessage(message);

    const handleLogin = (userData, redirectTo = '/dashboard') => {
        setOptimisticUser(userData);
        setProfessionHydrated(false);
        navigate(redirectTo, { replace: true });
        const name = userData?.user_metadata?.display_name || userData?.email?.split('@')[0] || 'User';
        showToast(`${t('dash.welcome')}, ${name}!`);
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        setOptimisticUser(null);
        setProfession(null);
        setProfessionHydrated(true);
        setIsProfessionModalOpen(false);
        navigate('/', { replace: true });

        try {
            await auth.signOut();
        } catch (err) {
            console.error('Logout error:', err);
            showToast('We could not sign you out. Please try again.');
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleProfessionSelect = async (profSlug) => {
        setProfession(profSlug);
        if (effectiveUser?.id) {
            await saveUserProfession(effectiveUser.id, profSlug);
        }
        setIsProfessionModalOpen(false);
        showToast('Profession updated!');
    };

    if (loading || (effectiveUser && !professionHydrated)) {
        return <AppLoader />;
    }

    return (
        <Layout
            activeSection={activeSection}
            user={effectiveUser}
            onLogout={handleLogout}
        >
            <Suspense fallback={<AppLoader label="Loading page..." />}>
                <Routes>
                    <Route path="/" element={<LandingPage setActiveSection={setActiveSection} />} />
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                    <Route path="/signup" element={<SignupPage onLogin={handleLogin} />} />
                    <Route path="/auth/callback" element={<AuthCallback onLogin={handleLogin} />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route
                        path="/dashboard"
                        element={(
                            <ProtectedRoute fallbackUser={optimisticUser}>
                                <Motion.main key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <Dashboard
                                        user={effectiveUser}
                                        profession={profession}
                                        onChangeProfession={() => setIsProfessionModalOpen(true)}
                                    />
                                </Motion.main>
                            </ProtectedRoute>
                        )}
                    />
                    <Route path="/resume" element={<ProtectedRoute fallbackUser={optimisticUser}><ResumePage profession={profession} /></ProtectedRoute>} />
                    <Route path="/mcq" element={<ProtectedRoute fallbackUser={optimisticUser}><MCQPage profession={profession} /></ProtectedRoute>} />
                    <Route path="/essay" element={<ProtectedRoute fallbackUser={optimisticUser}><EssayPage profession={profession} /></ProtectedRoute>} />
                    <Route path="/workstyle" element={<ProtectedRoute fallbackUser={optimisticUser}><WorkStylePage profession={profession} /></ProtectedRoute>} />
                    <Route path="/interview" element={<ProtectedRoute fallbackUser={optimisticUser}><InterviewPage profession={profession} /></ProtectedRoute>} />
                    <Route path="/history" element={<ProtectedRoute fallbackUser={optimisticUser}><HistoryPage /></ProtectedRoute>} />
                </Routes>
            </Suspense>

            <ProfessionModal
                key={`${isProfessionModalOpen ? 'open' : 'closed'}-${profession || 'none'}`}
                isOpen={isProfessionModalOpen}
                onSelect={handleProfessionSelect}
                initialProfession={profession}
            />

            <AnimatePresence>
                {toastMessage && (
                    <Toast key="app-toast" message={toastMessage} onClose={() => setToastMessage(null)} />
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default function App() {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}

