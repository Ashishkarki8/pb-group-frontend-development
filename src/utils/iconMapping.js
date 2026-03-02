// src/utils/iconMapping.js
import { 
  BarChart3, 
  Brain, 
  Code, 
  Briefcase, 
  GraduationCap, 
  TrendingUp,
  Database,
  Globe,
  Lightbulb,
  Users,
  Target,
  Zap,
  Smartphone,
  Monitor,
  Grid3x3
} from 'lucide-react';

/**
 * Icon configuration with metadata
 * Single source of truth for all icons in the application
 */
export const ICON_CONFIG = [
  { name: 'BarChart3', component: BarChart3, label: 'Chart' },
  { name: 'Brain', component: Brain, label: 'AI/Brain' },
  { name: 'Code', component: Code, label: 'Code' },
  { name: 'Briefcase', component: Briefcase, label: 'Business' },
  { name: 'GraduationCap', component: GraduationCap, label: 'Training' },
  { name: 'TrendingUp', component: TrendingUp, label: 'Analytics' },
  { name: 'Database', component: Database, label: 'Database' },
  { name: 'Globe', component: Globe, label: 'Global' },
  { name: 'Lightbulb', component: Lightbulb, label: 'Ideas' },
  { name: 'Users', component: Users, label: 'Team' },
  { name: 'Target', component: Target, label: 'Goals' },
  { name: 'Zap', component: Zap, label: 'Fast' },
  { name: 'Smartphone', component: Smartphone, label: 'Mobile' },
  { name: 'Monitor', component: Monitor, label: 'Computer' },
  { name: 'Grid3x3', component: Grid3x3, label: 'Dashboard' },
];

/**
 * Icon map for quick lookup
 */
export const iconMap = ICON_CONFIG.reduce((acc, icon) => {
  acc[icon.name] = icon.component;
  return acc;
}, {});

/**
 * Get icon component by name with fallback
 */
export const getIconComponent = (iconName) => {
  if (!iconName) return BarChart3; // Handle undefined/null
  return iconMap[iconName] || BarChart3; // Fallback to default
};

/**
 * Get all available icons for selection UI
 */
export const getAvailableIcons = () => ICON_CONFIG;




