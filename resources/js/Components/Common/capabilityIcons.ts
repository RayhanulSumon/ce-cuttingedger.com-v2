import {
    Box,
    BookOpen,
    Camera,
    Clapperboard,
    Gem,
    Languages,
    Layers,
    LayoutTemplate,
    Package,
    Palette,
    PenTool,
    Printer,
    RotateCw,
    Scissors,
    Shirt,
    Smartphone,
    Sparkles,
    Users,
    Video,
    Wand2,
} from 'lucide-react';

type IconComponent = React.ComponentType<{ size?: number | string; className?: string }>;

/** Icons an admin can pick for a capability. The saved value is the key. */
export const CAPABILITY_ICONS: Record<string, IconComponent> = {
    Layers,
    Scissors,
    Wand2,
    Shirt,
    Sparkles,
    Gem,
    Palette,
    Box,
    Camera,
    Users,
    RotateCw,
    LayoutTemplate,
    BookOpen,
    Languages,
    PenTool,
    Printer,
    Package,
    Clapperboard,
    Video,
    Smartphone,
};

export const CAPABILITY_ICON_NAMES = Object.keys(CAPABILITY_ICONS);

/** Icon for a saved name, falling back to a generic one. */
export function capabilityIcon(name?: string | null): IconComponent {
    return (name && CAPABILITY_ICONS[name]) || Layers;
}
