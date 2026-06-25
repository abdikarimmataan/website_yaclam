export interface PageCmsConfig {
  id: string;
  title?: string;
  subtitle?: string;
  emptyStateText?: string;
  isVisible?: boolean;
  del_status?: string;
}

export interface PageCmsView {
  isVisible: boolean;
  title: string;
  subtitle: string;
  emptyStateText: string;
}

export type PageCmsKey = "course" | "roadmap" | "scholarship" | "university" | "blog" | "about" | "contact";
