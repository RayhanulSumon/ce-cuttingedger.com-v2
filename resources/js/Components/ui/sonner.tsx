import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
    return (
        <Sonner
            theme="light"
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-ink group-[.toaster]:border group-[.toaster]:border-slate-200 group-[.toaster]:shadow-xl group-[.toaster]:font-mono group-[.toaster]:text-xs",
                    description: "group-[.toast]:text-slate-500 font-sans",
                    actionButton: "group-[.toast]:bg-primary group-[.toast]:text-white font-mono font-bold",
                    cancelButton: "group-[.toast]:bg-slate-100 group-[.toast]:text-ink",
                    success: "group-[.toaster]:border-emerald-200 group-[.toaster]:text-emerald-800",
                    error: "group-[.toaster]:border-rose-200 group-[.toaster]:text-rose-800",
                },
            }}
            richColors
            closeButton
            position="top-right"
            {...props}
        />
    );
}

export { toast } from "sonner";
