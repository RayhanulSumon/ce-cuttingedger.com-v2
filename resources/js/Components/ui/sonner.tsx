import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
    return (
        <Sonner
            theme="light"
            position="bottom-right"
            duration={2200}
            visibleToasts={2}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: "group toast group-[.toaster]:bg-surface group-[.toaster]:text-ink group-[.toaster]:border group-[.toaster]:border-line group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:font-sans group-[.toaster]:text-sm group-[.toaster]:font-medium group-[.toaster]:px-4 group-[.toaster]:py-3",
                    description: "group-[.toast]:text-subtle text-xs",
                    actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-sans font-semibold",
                    cancelButton: "group-[.toast]:bg-surface-2 group-[.toast]:text-ink",
                    success: "group-[.toaster]:border-success/25 [&_[data-icon]]:text-success",
                    error: "group-[.toaster]:border-danger/25 [&_[data-icon]]:text-danger",
                },
            }}
            {...props}
        />
    );
}

export { toast } from "sonner";
