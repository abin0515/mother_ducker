/**
 * 🎨 Mother Ducker Design System
 * 
 * A comprehensive UI component library for the Mother Ducker platform.
 * Designed for accessibility, consistency, and ease of use.
 * 
 * @author Your Development Team
 * @version 1.0.0
 */

// ===== COMPONENT IMPORTS =====
import ButtonComponent from './Button';
import { 
  Card as CardComponent, 
  CardHeader as CardHeaderComponent, 
  CardTitle as CardTitleComponent, 
  CardContent as CardContentComponent, 
  CardActions as CardActionsComponent 
} from './Card';
import BadgeComponent from './Badge';
import SectionHeaderComponent from './SectionHeader';
import PhotoGalleryComponent from './PhotoGallery';
import PhotoLightboxComponent from './PhotoLightbox';
import LanguageSwitcherComponent from './LanguageSwitcher';
import CurrentLocationMapComponent from './CurrentLocationMap';
import InputComponent from './Input';
import ModalComponent, { ModalHeader as ModalHeaderComponent, ModalBody as ModalBodyComponent, ModalFooter as ModalFooterComponent } from './Modal';
import SpinnerComponent, { LoadingOverlay as LoadingOverlayComponent } from './Spinner';
import AlertComponent, { InfoAlert as InfoAlertComponent, SuccessAlert as SuccessAlertComponent, WarningAlert as WarningAlertComponent, ErrorAlert as ErrorAlertComponent } from './Alert';
import TooltipComponent, { SimpleTooltip as SimpleTooltipComponent, HelpTooltip as HelpTooltipComponent } from './Tooltip';

// ===== CORE COMPONENTS =====
// Essential building blocks for consistent UI

export { ButtonComponent as Button };
export type { ButtonProps } from './Button';

export { 
  CardComponent as Card, 
  CardHeaderComponent as CardHeader, 
  CardTitleComponent as CardTitle, 
  CardContentComponent as CardContent, 
  CardActionsComponent as CardActions 
};
export type { 
  CardProps, 
  CardHeaderProps, 
  CardTitleProps, 
  CardContentProps, 
  CardActionsProps 
} from './Card';

export { BadgeComponent as Badge };
export type { BadgeProps } from './Badge';

export { SectionHeaderComponent as SectionHeader };
export type { SectionHeaderProps } from './SectionHeader';

export { InputComponent as Input };
export type { InputProps } from './Input';

export { 
  ModalComponent as Modal,
  ModalHeaderComponent as ModalHeader,
  ModalBodyComponent as ModalBody,
  ModalFooterComponent as ModalFooter
};
export type { 
  ModalProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps
} from './Modal';

export { 
  SpinnerComponent as Spinner,
  LoadingOverlayComponent as LoadingOverlay
};
export type { SpinnerProps, LoadingOverlayProps } from './Spinner';

export { 
  AlertComponent as Alert,
  InfoAlertComponent as InfoAlert,
  SuccessAlertComponent as SuccessAlert,
  WarningAlertComponent as WarningAlert,
  ErrorAlertComponent as ErrorAlert
};
export type { AlertProps } from './Alert';

export { 
  TooltipComponent as Tooltip,
  SimpleTooltipComponent as SimpleTooltip,
  HelpTooltipComponent as HelpTooltip
};
export type { TooltipProps, SimpleTooltipProps, HelpTooltipProps } from './Tooltip';

// ===== FORM COMPONENTS =====
// Interactive elements for data input and selection

import LanguageSelectorComponent from './LanguageSelector';
import SpecializationSelectorComponent from './SpecializationSelector';
import ServiceSelectorComponent from './ServiceSelector';
import ProvinceSelectorComponent from './ProvinceSelector';

export { LanguageSelectorComponent as LanguageSelector };
export type { LanguageSelectorProps } from './LanguageSelector';

export { SpecializationSelectorComponent as SpecializationSelector };
export type { SpecializationSelectorProps } from './SpecializationSelector';

export { ServiceSelectorComponent as ServiceSelector };
export type { ServiceSelectorProps } from './ServiceSelector';

export { ProvinceSelectorComponent as ProvinceSelector };
export type { ProvinceSelectorProps } from './ProvinceSelector';

// ===== MEDIA COMPONENTS =====
// Components for handling images and media content

export { PhotoGalleryComponent as PhotoGallery };
export type { PhotoGalleryProps } from './PhotoGallery';

export { PhotoLightboxComponent as PhotoLightbox };
export type { PhotoLightboxProps } from './PhotoLightbox';

// ===== NAVIGATION COMPONENTS =====
// Components for navigation and language switching

export { LanguageSwitcherComponent as LanguageSwitcher };
export type { LanguageSwitcherProps } from './LanguageSwitcher';

// ===== MAP COMPONENTS =====
// Location and mapping functionality

export { CurrentLocationMapComponent as CurrentLocationMap };
export type { CurrentLocationMapProps } from './CurrentLocationMap';

// ===== COMPONENT CATEGORIES =====
// Organized exports for easier discovery

/**
 * Core UI building blocks
 */
export const CoreComponents = {
  Button: ButtonComponent,
  Card: CardComponent,
  CardHeader: CardHeaderComponent,
  CardTitle: CardTitleComponent,
  CardContent: CardContentComponent,
  CardActions: CardActionsComponent,
  Badge: BadgeComponent,
  SectionHeader: SectionHeaderComponent,
  Input: InputComponent,
  Modal: ModalComponent,
  ModalHeader: ModalHeaderComponent,
  ModalBody: ModalBodyComponent,
  ModalFooter: ModalFooterComponent,
  Spinner: SpinnerComponent,
  LoadingOverlay: LoadingOverlayComponent,
  Alert: AlertComponent,
  InfoAlert: InfoAlertComponent,
  SuccessAlert: SuccessAlertComponent,
  WarningAlert: WarningAlertComponent,
  ErrorAlert: ErrorAlertComponent,
  Tooltip: TooltipComponent,
  SimpleTooltip: SimpleTooltipComponent,
  HelpTooltip: HelpTooltipComponent
} as const;

/**
 * Form and input components
 */
export const FormComponents = {
  Input: InputComponent,
  LanguageSelector: LanguageSelectorComponent,
  SpecializationSelector: SpecializationSelectorComponent,
  ServiceSelector: ServiceSelectorComponent,
  ProvinceSelector: ProvinceSelectorComponent
} as const;

/**
 * Media handling components
 */
export const MediaComponents = {
  PhotoGallery: PhotoGalleryComponent,
  PhotoLightbox: PhotoLightboxComponent
} as const;

/**
 * Navigation components
 */
export const NavigationComponents = {
  LanguageSwitcher: LanguageSwitcherComponent
} as const;

/**
 * Location and mapping components
 */
export const MapComponents = {
  CurrentLocationMap: CurrentLocationMapComponent
} as const;

// ===== DESIGN TOKENS =====
// Design system constants (can be expanded)

/**
 * Standard spacing scale used throughout the design system
 */
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem'    // 64px
} as const;

/**
 * Color variants used in components
 */
export const variants = {
  button: ['primary', 'secondary', 'ghost', 'danger', 'success'],
  badge: ['default', 'success', 'warning', 'danger', 'info', 'purple'],
  card: ['default', 'elevated', 'outlined', 'ghost']
} as const;

/**
 * Component sizes
 */
export const sizes = {
  button: ['sm', 'md', 'lg', 'xl'],
  badge: ['sm', 'md', 'lg']
} as const;
