interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="text-center py-12 px-4">
    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all"
      >
        {action.label}
      </button>
    )}
  </div>
);
