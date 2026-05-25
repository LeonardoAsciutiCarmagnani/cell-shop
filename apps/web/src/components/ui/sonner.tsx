import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = (props: ToasterProps) => (
  <Sonner
    position="top-right"
    richColors
    closeButton
    toastOptions={{
      classNames: {
        toast: 'group toast bg-popover text-popover-foreground border-border shadow-lg',
      },
    }}
    {...props}
  />
);

export { Toaster };
