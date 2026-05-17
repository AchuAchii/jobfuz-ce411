import { FileCheck, CheckCircle, FileText, Brain, Bot } from 'lucide-react';

/**
 * Single source of truth for all assessment tools across Jobfuz.
 * 
 * Fields:
 * - id: unique identifier
 * - path: route to navigate to
 * - icon: Lucide icon component
 * - color: brand styling color
 * - category: grouping for menus (e.g., 'Core', 'Advanced')
 * - labelKey: i18n key for the label
 * - descKey: i18n key for the description
 * - showInSidebar: boolean, whether to render in AppSidebar
 * - showInLauncher: boolean, whether to render in Dashboard "Start New" modals
 */
export const ASSESSMENTS = [
    {
        id: 'resume',
        path: '/resume',
        icon: FileCheck,
        color: '#60A5FA',
        category: 'Document',
        labelKey: 'nav.resume',
        descKey: 'feat.resume.desc',
        showInSidebar: true,
        showInLauncher: true,
    },
    {
        id: 'mcq',
        path: '/mcq',
        icon: CheckCircle,
        color: '#34D399',
        category: 'Knowledge',
        labelKey: 'nav.mcq',
        descKey: 'feat.mcq.desc',
        showInSidebar: true,
        showInLauncher: true,
    },
    {
        id: 'essay',
        path: '/essay',
        icon: FileText,
        color: '#A78BFA',
        category: 'Communication',
        labelKey: 'nav.essay',
        descKey: 'feat.essay.desc',
        showInSidebar: true,
        showInLauncher: true,
    },
    {
        id: 'workstyle',
        path: '/workstyle',
        icon: Brain,
        color: '#F09808',
        category: 'Behavioral',
        labelKey: 'nav.workstyle',
        descKey: 'feat.workstyle.desc',
        showInSidebar: true,
        showInLauncher: true,
    },
    {
        id: 'interview',
        path: '/interview',
        icon: Bot,
        color: '#F87171',
        category: 'Communication',
        labelKey: 'nav.interview',
        descKey: 'feat.ai.desc',
        showInSidebar: true,
        showInLauncher: true,
    }
];
