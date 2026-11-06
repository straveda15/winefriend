interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = "" }: ContainerProps) {
  return <div className={`w-full px-5 sm:px-8 lg:px-12 2xl:px-16 ${className}`}>{children}</div>;
}
