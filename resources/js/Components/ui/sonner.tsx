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
                    toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-ink group-[.toaster]:border group-[.toaster]:border-slate-200/90 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:font-sans group-[.toaster]:text-[13px] group-[.toaster]:font-medium group-[.toaster]:px-4 group-[.toaster]:py-3",
                    description: "group-[.toast]:text-slate-500 text-xs",
                    actionButton: "group-[.toast]:bg-primary group-[.toast]:text-white font-sans font-semibold",
                    cancelButton: "group-[.toast]:bg-slate-100 group-[.toast]:text-ink",
                    success: "group-[.toaster]:border-emerald-200/90 [&_[data-icon]]:text-emerald-600",
                    error: "group-[.toaster]:border-rose-200/90 [&_[data-icon]]:text-rose-600",
                },
            }}
            {...props}
        />
    );
}

export { toast } from "sonner";
