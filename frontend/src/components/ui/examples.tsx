/**
 * 📚 Component Library Usage Examples
 * 
 * This file demonstrates how to use the Mother Ducker Design System components.
 * These examples can be used as reference for development.
 */

import React from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardActions,
  Badge,
  SectionHeader,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  LoadingOverlay,
  Alert,
  InfoAlert,
  SuccessAlert,
  WarningAlert,
  ErrorAlert,
  Tooltip,
  SimpleTooltip,
  HelpTooltip,
  // Form Components
  LanguageSelector,
  SpecializationSelector,
  ServiceSelector,
  ProvinceSelector,
  // Media Components
  PhotoGallery,
  // Navigation
  LanguageSwitcher,
  // Map Components
  CurrentLocationMap
} from './index';

// ===== BUTTON EXAMPLES =====

export const ButtonExamples = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Button Examples</h3>
    
    {/* Basic Buttons */}
    <div className="flex gap-3 flex-wrap">
      <Button variant="primary">Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="ghost">Ghost Button</Button>
      <Button variant="danger">Danger Button</Button>
      <Button variant="success">Success Button</Button>
    </div>

    {/* Button Sizes */}
    <div className="flex gap-3 items-center flex-wrap">
      <Button variant="primary" size="sm">Small</Button>
      <Button variant="primary" size="md">Medium</Button>
      <Button variant="primary" size="lg">Large</Button>
      <Button variant="primary" size="xl">Extra Large</Button>
    </div>

    {/* Buttons with Icons and States */}
    <div className="flex gap-3 flex-wrap">
      <Button 
        variant="primary" 
        icon={<span>💾</span>}
      >
        Save
      </Button>
      <Button 
        variant="secondary" 
        loading={true}
      >
        Loading...
      </Button>
      <Button 
        variant="ghost" 
        disabled={true}
      >
        Disabled
      </Button>
    </div>
  </div>
);

// ===== CARD EXAMPLES =====

export const CardExamples = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold">Card Examples</h3>
    
    {/* Basic Card */}
    <Card variant="default" padding="md">
      <CardContent>
        <p>This is a basic card with default styling.</p>
      </CardContent>
    </Card>

    {/* Elevated Card with Header */}
    <Card variant="elevated" padding="lg">
      <CardHeader>
        <CardTitle level={3}>User Profile</CardTitle>
        <Button variant="ghost" size="sm">Edit</Button>
      </CardHeader>
      
      <CardContent>
        <p>This card has elevation and includes a header with title and action button.</p>
      </CardContent>
    </Card>

    {/* Card with Actions */}
    <Card variant="outlined" padding="lg">
      <CardHeader>
        <CardTitle level={4}>Confirm Action</CardTitle>
      </CardHeader>
      
      <CardContent>
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
      </CardContent>
      
      <CardActions align="right">
        <Button variant="secondary">Cancel</Button>
        <Button variant="danger">Delete</Button>
      </CardActions>
    </Card>
  </div>
);

// ===== BADGE EXAMPLES =====

export const BadgeExamples = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Badge Examples</h3>
    
    {/* Status Badges */}
    <div className="flex gap-3 flex-wrap">
      <Badge variant="success">Verified</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="danger">Rejected</Badge>
      <Badge variant="info">Information</Badge>
      <Badge variant="purple">Premium</Badge>
      <Badge variant="default">Default</Badge>
    </div>

    {/* Badge Sizes */}
    <div className="flex gap-3 items-center flex-wrap">
      <Badge variant="success" size="sm">Small</Badge>
      <Badge variant="success" size="md">Medium</Badge>
      <Badge variant="success" size="lg">Large</Badge>
    </div>

    {/* Badges with Icons */}
    <div className="flex gap-3 flex-wrap">
      <Badge variant="success" icon="✓">Verified User</Badge>
      <Badge variant="warning" icon="⏳">Pending Review</Badge>
      <Badge variant="purple" icon="👑">月嫂</Badge>
    </div>
  </div>
);

// ===== FORM COMPONENT EXAMPLES =====

export const FormExamples = () => {
  const [language, setLanguage] = React.useState('');
  const [specialization, setSpecialization] = React.useState('');
  const [service, setService] = React.useState('');
  const [province, setProvince] = React.useState('');

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Form Component Examples</h3>
      
      <Card variant="default" padding="lg">
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Languages</label>
              <LanguageSelector
                value={language}
                onChange={setLanguage}
                placeholder="Select languages..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Specializations</label>
              <SpecializationSelector
                value={specialization}
                onChange={setSpecialization}
                placeholder="Select specializations..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Services</label>
              <ServiceSelector
                value={service}
                onChange={setService}
                placeholder="Select services..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Province</label>
              <ProvinceSelector
                value={province}
                onChange={setProvince}
                placeholder="Select province..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ===== COMPLETE EXAMPLE =====

export const CompleteExample = () => {
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <SectionHeader
        title="User Profile"
        subtitle="Manage your profile information"
        action={
          <Button 
            variant={isEditing ? "secondary" : "primary"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle level={3}>Basic Info</CardTitle>
            <Badge variant="success">Verified</Badge>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Name:</span>
                <span className="ml-2 text-gray-900">张月嫂</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Type:</span>
                <Badge variant="purple" size="sm" className="ml-2">月嫂</Badge>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Location:</span>
                <span className="ml-2 text-gray-900">北京</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Info */}
        <div className="lg:col-span-2">
          <Card variant="elevated" padding="lg">
            <CardHeader>
              <CardTitle level={3}>Professional Information</CardTitle>
              <Button variant="ghost" size="sm">Edit</Button>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-semibold text-gray-600">Experience:</span>
                  <p className="mt-1 text-gray-900">5年</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-600">Languages:</span>
                  <p className="mt-1 text-gray-900">中文, 英语</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Photo Gallery */}
      <Card variant="elevated" padding="lg">
        <CardHeader>
          <CardTitle level={3}>Photo Gallery</CardTitle>
          <Button variant="ghost" size="sm">Manage Photos</Button>
        </CardHeader>
        
        <CardContent>
          <PhotoGallery
            photos={[
              'https://via.placeholder.com/300x300?text=Photo+1',
              'https://via.placeholder.com/300x300?text=Photo+2',
              'https://via.placeholder.com/300x300?text=Photo+3'
            ]}
            gridCols={3}
            aspectRatio="square"
          />
        </CardContent>
      </Card>
    </div>
  );
};

// ===== NEW COMPONENT EXAMPLES =====

export const InputExamples = () => {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState('');

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Input Examples</h3>
      
      {/* Basic Inputs */}
      <div className="space-y-4">
        <Input
          label="Default Input"
          placeholder="Enter text..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <Input
          variant="filled"
          label="Filled Input"
          placeholder="Filled variant..."
          helperText="This is a filled input variant"
        />

        <Input
          variant="outlined"
          label="Outlined Input"
          placeholder="Outlined variant..."
        />
      </div>

      {/* Input States */}
      <div className="space-y-4">
        <Input
          label="Success State"
          state="success"
          placeholder="Valid input..."
          helperText="Input is valid"
        />

        <Input
          label="Error State"
          state="error"
          placeholder="Invalid input..."
          errorMessage="This field is required"
        />

        <Input
          label="Loading Input"
          placeholder="Processing..."
          loading={true}
        />
      </div>

      {/* Input with Icons */}
      <div className="space-y-4">
        <Input
          label="Search Input"
          placeholder="Search..."
          leftIcon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />

        <Input
          label="Password Input"
          type="password"
          placeholder="Enter password..."
          rightIcon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />
      </div>
    </div>
  );
};

export const ModalExamples = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [modalSize, setModalSize] = React.useState<'sm' | 'md' | 'lg' | 'xl'>('md');

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Modal Examples</h3>
      
      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => { setModalSize('sm'); setIsOpen(true); }}>
          Small Modal
        </Button>
        <Button onClick={() => { setModalSize('md'); setIsOpen(true); }}>
          Medium Modal
        </Button>
        <Button onClick={() => { setModalSize('lg'); setIsOpen(true); }}>
          Large Modal
        </Button>
        <Button onClick={() => { setModalSize('xl'); setIsOpen(true); }}>
          Extra Large Modal
        </Button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size={modalSize}
        title="Example Modal"
        description="This is an example modal with different sizes"
      >
        <ModalBody>
          <p className="text-gray-700">
            This modal demonstrates the {modalSize} size variant. You can customize the content, 
            add forms, images, or any other React components here.
          </p>
          
          <div className="mt-4 space-y-3">
            <Input label="Name" placeholder="Enter your name..." />
            <Input label="Email" type="email" placeholder="Enter your email..." />
          </div>
        </ModalBody>
        
        <ModalFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setIsOpen(false)}>
            Save Changes
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export const SpinnerExamples = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Spinner Examples</h3>
      
      {/* Basic Spinners */}
      <div className="flex items-center gap-6 flex-wrap">
        <div className="text-center">
          <Spinner size="xs" />
          <p className="text-xs mt-2">Extra Small</p>
        </div>
        <div className="text-center">
          <Spinner size="sm" />
          <p className="text-xs mt-2">Small</p>
        </div>
        <div className="text-center">
          <Spinner size="md" />
          <p className="text-xs mt-2">Medium</p>
        </div>
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-xs mt-2">Large</p>
        </div>
        <div className="text-center">
          <Spinner size="xl" />
          <p className="text-xs mt-2">Extra Large</p>
        </div>
      </div>

      {/* Spinner Variants */}
      <div className="flex items-center gap-6 flex-wrap">
        <div className="text-center">
          <Spinner variant="default" />
          <p className="text-xs mt-2">Default</p>
        </div>
        <div className="text-center">
          <Spinner variant="dots" />
          <p className="text-xs mt-2">Dots</p>
        </div>
        <div className="text-center">
          <Spinner variant="pulse" />
          <p className="text-xs mt-2">Pulse</p>
        </div>
        <div className="text-center">
          <Spinner variant="bars" />
          <p className="text-xs mt-2">Bars</p>
        </div>
      </div>

      {/* Loading Overlay */}
      <div>
        <Button onClick={simulateLoading} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Test Loading Overlay'}
        </Button>
        
        <LoadingOverlay 
          isLoading={isLoading} 
          message="Processing your request..."
          className="mt-4"
        >
          <Card padding="lg">
            <CardContent>
              <p>This content will be overlaid with a loading spinner when active.</p>
              <p className="mt-2">Click the button above to see the loading overlay in action.</p>
            </CardContent>
          </Card>
        </LoadingOverlay>
      </div>
    </div>
  );
};

export const AlertExamples = () => {
  const [alerts, setAlerts] = React.useState([
    { id: 1, type: 'info' as const, visible: true },
    { id: 2, type: 'success' as const, visible: true },
    { id: 3, type: 'warning' as const, visible: true },
    { id: 4, type: 'error' as const, visible: true }
  ]);

  const dismissAlert = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, visible: false } : alert
    ));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Alert Examples</h3>
      
      <div className="space-y-4">
        {alerts.filter(alert => alert.visible).map(alert => {
          const AlertComponent = {
            info: InfoAlert,
            success: SuccessAlert,
            warning: WarningAlert,
            error: ErrorAlert
          }[alert.type];

          const content = {
            info: 'This is an informational message with helpful details.',
            success: 'Your changes have been saved successfully!',
            warning: 'Please review your input before continuing.',
            error: 'An error occurred while processing your request.'
          }[alert.type];

          const title = {
            info: 'Information',
            success: 'Success',
            warning: 'Warning',
            error: 'Error'
          }[alert.type];

          return (
            <AlertComponent
              key={alert.id}
              title={title}
              dismissible
              onDismiss={() => dismissAlert(alert.id)}
            >
              {content}
            </AlertComponent>
          );
        })}
      </div>

      <Button 
        variant="secondary" 
        onClick={() => setAlerts(alerts.map(alert => ({ ...alert, visible: true })))}
      >
        Reset All Alerts
      </Button>
    </div>
  );
};

export const TooltipExamples = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Tooltip Examples</h3>
      
      {/* Basic Tooltips */}
      <div className="flex items-center gap-4 flex-wrap">
        <Tooltip content="This tooltip appears on top" position="top">
          <Button variant="secondary">Top Tooltip</Button>
        </Tooltip>
        
        <Tooltip content="This tooltip appears on bottom" position="bottom">
          <Button variant="secondary">Bottom Tooltip</Button>
        </Tooltip>
        
        <Tooltip content="This tooltip appears on left" position="left">
          <Button variant="secondary">Left Tooltip</Button>
        </Tooltip>
        
        <Tooltip content="This tooltip appears on right" position="right">
          <Button variant="secondary">Right Tooltip</Button>
        </Tooltip>
      </div>

      {/* Tooltip Triggers */}
      <div className="flex items-center gap-4 flex-wrap">
        <Tooltip content="Hover over me" trigger="hover">
          <Button variant="ghost">Hover Trigger</Button>
        </Tooltip>
        
        <Tooltip content="Click me to toggle" trigger="click">
          <Button variant="ghost">Click Trigger</Button>
        </Tooltip>
        
        <Tooltip content="Focus on me with Tab" trigger="focus">
          <Button variant="ghost">Focus Trigger</Button>
        </Tooltip>
      </div>

      {/* Help Tooltip */}
      <div className="flex items-center gap-2">
        <span>Complex Feature</span>
        <HelpTooltip content="This feature allows you to perform advanced operations with multiple options and configurations." />
      </div>

      {/* Simple Tooltip */}
      <div className="flex items-center gap-2">
        <span>Simple Feature</span>
        <SimpleTooltip text="Just a simple explanation">
          <span className="text-blue-500 cursor-help">(?)</span>
        </SimpleTooltip>
      </div>
    </div>
  );
};

export default {
  ButtonExamples,
  CardExamples,
  BadgeExamples,
  FormExamples,
  InputExamples,
  ModalExamples,
  SpinnerExamples,
  AlertExamples,
  TooltipExamples,
  CompleteExample
};
