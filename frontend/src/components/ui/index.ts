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

// New core components
import { 
  Dialog as DialogComponent,
  DialogContent as DialogContentComponent,
  DialogHeader as DialogHeaderComponent,
  DialogTitle as DialogTitleComponent,
  DialogClose as DialogCloseComponent,
  DialogBody as DialogBodyComponent,
  DialogFooter as DialogFooterComponent
} from './Dialog';
import { 
  Form as FormComponent,
  FormField as FormFieldComponent,
  FormLabel as FormLabelComponent,
  FormError as FormErrorComponent,
  FormHelp as FormHelpComponent,
  FormGroup as FormGroupComponent,
  FormActions as FormActionsComponent
} from './Form';
import { 
  Menu as MenuComponent,
  MenuTrigger as MenuTriggerComponent,
  MenuContent as MenuContentComponent,
  MenuItem as MenuItemComponent,
  MenuSeparator as MenuSeparatorComponent,
  MenuLabel as MenuLabelComponent,
  DropdownMenu as DropdownMenuComponent
} from './Menu';
import { 
  Notification as NotificationComponent,
  NotificationContainer as NotificationContainerComponent,
  toast
} from './Notification';
import { 
  Pagination as PaginationComponent,
  PaginationInfo as PaginationInfoComponent
} from './Pagination';
import { 
  Section as SectionComponent,
  SectionContainer as SectionContainerComponent,
  SectionHeaderLayout as SectionHeaderLayoutComponent,
  SectionTitle as SectionTitleComponent,
  SectionSubtitle as SectionSubtitleComponent,
  SectionContent as SectionContentComponent,
  SectionGrid as SectionGridComponent,
  SectionActions as SectionActionsComponent
} from './Sections';
import { 
  Tabs as TabsComponent,
  TabsList as TabsListComponent,
  TabsTrigger as TabsTriggerComponent,
  TabsContent as TabsContentComponent,
  TabsHeader as TabsHeaderComponent,
  TabsTitle as TabsTitleComponent,
  TabsDescription as TabsDescriptionComponent
} from './Tabs';
import { 
  Tag as TagComponent,
  TagList as TagListComponent,
  TagInput as TagInputComponent,
  TagFilter as TagFilterComponent
} from './Tags';

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

// New core components exports
export { 
  DialogComponent as Dialog,
  DialogContentComponent as DialogContent,
  DialogHeaderComponent as DialogHeader,
  DialogTitleComponent as DialogTitle,
  DialogCloseComponent as DialogClose,
  DialogBodyComponent as DialogBody,
  DialogFooterComponent as DialogFooter
};
export type { 
  DialogProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogCloseProps,
  DialogBodyProps,
  DialogFooterProps
} from './Dialog';

export { 
  FormComponent as Form,
  FormFieldComponent as FormField,
  FormLabelComponent as FormLabel,
  FormErrorComponent as FormError,
  FormHelpComponent as FormHelp,
  FormGroupComponent as FormGroup,
  FormActionsComponent as FormActions
};
export type { 
  FormProps,
  FormFieldProps,
  FormLabelProps,
  FormErrorProps,
  FormHelpProps,
  FormGroupProps,
  FormActionsProps
} from './Form';

export { 
  MenuComponent as Menu,
  MenuTriggerComponent as MenuTrigger,
  MenuContentComponent as MenuContent,
  MenuItemComponent as MenuItem,
  MenuSeparatorComponent as MenuSeparator,
  MenuLabelComponent as MenuLabel,
  DropdownMenuComponent as DropdownMenu
};
export type { 
  MenuProps,
  MenuTriggerProps,
  MenuContentProps,
  MenuItemProps,
  MenuSeparatorProps,
  MenuLabelProps,
  DropdownMenuProps
} from './Menu';

export { 
  NotificationComponent as Notification,
  NotificationContainerComponent as NotificationContainer,
  toast
};
export type { NotificationProps, NotificationContainerProps, ToastProps } from './Notification';

export { 
  PaginationComponent as Pagination,
  PaginationInfoComponent as PaginationInfo
};
export type { PaginationProps, PaginationInfoProps } from './Pagination';

export { 
  SectionComponent as Section,
  SectionContainerComponent as SectionContainer,
  SectionHeaderLayoutComponent as SectionHeaderLayout,
  SectionTitleComponent as SectionTitle,
  SectionSubtitleComponent as SectionSubtitle,
  SectionContentComponent as SectionContent,
  SectionGridComponent as SectionGrid,
  SectionActionsComponent as SectionActions
};
export type { 
  SectionProps,
  SectionContainerProps,
  SectionHeaderProps as SectionHeaderLayoutProps,
  SectionTitleProps,
  SectionSubtitleProps,
  SectionContentProps,
  SectionGridProps,
  SectionActionsProps
} from './Sections';

export { 
  TabsComponent as Tabs,
  TabsListComponent as TabsList,
  TabsTriggerComponent as TabsTrigger,
  TabsContentComponent as TabsContent,
  TabsHeaderComponent as TabsHeader,
  TabsTitleComponent as TabsTitle,
  TabsDescriptionComponent as TabsDescription
};
export type { 
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  TabsHeaderProps,
  TabsTitleProps,
  TabsDescriptionProps
} from './Tabs';

export { 
  TagComponent as Tag,
  TagListComponent as TagList,
  TagInputComponent as TagInput,
  TagFilterComponent as TagFilter
};
export type { TagProps, TagListProps, TagInputProps, TagFilterProps } from './Tags';

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
  HelpTooltip: HelpTooltipComponent,
  // New core components
  Dialog: DialogComponent,
  DialogContent: DialogContentComponent,
  DialogHeader: DialogHeaderComponent,
  DialogTitle: DialogTitleComponent,
  DialogClose: DialogCloseComponent,
  DialogBody: DialogBodyComponent,
  DialogFooter: DialogFooterComponent,
  Menu: MenuComponent,
  MenuTrigger: MenuTriggerComponent,
  MenuContent: MenuContentComponent,
  MenuItem: MenuItemComponent,
  MenuSeparator: MenuSeparatorComponent,
  MenuLabel: MenuLabelComponent,
  DropdownMenu: DropdownMenuComponent,
  Notification: NotificationComponent,
  NotificationContainer: NotificationContainerComponent,
  Pagination: PaginationComponent,
  PaginationInfo: PaginationInfoComponent,
  Section: SectionComponent,
  SectionContainer: SectionContainerComponent,
  SectionHeaderLayout: SectionHeaderLayoutComponent,
  SectionTitle: SectionTitleComponent,
  SectionSubtitle: SectionSubtitleComponent,
  SectionContent: SectionContentComponent,
  SectionGrid: SectionGridComponent,
  SectionActions: SectionActionsComponent,
  Tabs: TabsComponent,
  TabsList: TabsListComponent,
  TabsTrigger: TabsTriggerComponent,
  TabsContent: TabsContentComponent,
  TabsHeader: TabsHeaderComponent,
  TabsTitle: TabsTitleComponent,
  TabsDescription: TabsDescriptionComponent,
  Tag: TagComponent,
  TagList: TagListComponent,
  TagInput: TagInputComponent,
  TagFilter: TagFilterComponent
} as const;

/**
 * Form and input components
 */
export const FormComponents = {
  Input: InputComponent,
  Form: FormComponent,
  FormField: FormFieldComponent,
  FormLabel: FormLabelComponent,
  FormError: FormErrorComponent,
  FormHelp: FormHelpComponent,
  FormGroup: FormGroupComponent,
  FormActions: FormActionsComponent,
  LanguageSelector: LanguageSelectorComponent,
  SpecializationSelector: SpecializationSelectorComponent,
  ServiceSelector: ServiceSelectorComponent,
  ProvinceSelector: ProvinceSelectorComponent,
  TagInput: TagInputComponent,
  TagFilter: TagFilterComponent
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
