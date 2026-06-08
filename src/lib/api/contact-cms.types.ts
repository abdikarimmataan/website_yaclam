export interface ContactInfoSection {
  icon?: string;
  title?: string;
  description?: string;
  isVisible?: boolean;
}

export interface ContactCmsConfig {
  id: string;
  title?: string;
  subtitle?: string;
  emptyStateText?: string;
  pageSection?: {
    title?: string;
    subtitle?: string;
    isVisible?: boolean;
  };
  emailSection?: ContactInfoSection;
  phoneSection?: ContactInfoSection;
  locationSection?: ContactInfoSection;
  isVisible?: boolean;
  del_status?: string;
}

export interface ContactInfoView {
  icon: string;
  title: string;
  description: string;
  isVisible: boolean;
}

export interface ContactCmsView {
  isVisible: boolean;
  title: string;
  subtitle: string;
  emptyStateText: string;
  email: ContactInfoView;
  phone: ContactInfoView;
  location: ContactInfoView;
}
