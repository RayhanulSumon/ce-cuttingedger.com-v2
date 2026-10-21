import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
    return (
        <Sonner
            theme="dark"
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: "group toast group-[.toaster]:bg-[#0c0d12]/95 group-[.toaster]:text-white group-[.toaster]:border group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:backdrop-blur-xl group-[.toaster]:font-mono group-[.toaster]:text-xs",
                    description: "group-[.toast]:text-neutral-400 font-sans",
                    actionButton: "group-[.toast]:bg-[#d4ff00] group-[.toast]:text-black font-mono font-bold",
                    cancelButton: "group-[.toast]:bg-white/10 group-[.toast]:text-white",
                    success: "group-[.toaster]:border-emerald-500/40 group-[.toaster]:text-emerald-300",
                    error: "group-[.toaster]:border-rose-500/40 group-[.toaster]:text-rose-300",
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
