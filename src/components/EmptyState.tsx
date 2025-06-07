import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  emoji?: string;
}

const EmptyState = ({ title, description, emoji = "👀" }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md">{description}</p>
    </div>
  );
};

export default EmptyState;