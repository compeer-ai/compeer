import * as icons from "$lib/components/icons";

export interface Integration {
    name: string;
    description: string;
    slug: string;
    tag: 'Harness' | "Inference" | "Developer Tool" | "Authentication"
    icon: keyof typeof icons
    content: string
}