'use client';

import Link from "next/link"
import {
    Home,
    Layers3,
    Package,
    Package2,
    Palette,
    Presentation,
    Ruler,
    Settings,
    ShoppingCart,
} from "lucide-react"

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useParams, usePathname } from "next/navigation";

export default function Sidebar() {
    const pathName = usePathname();
    const params = useParams();

    const routes = [
        {
            title: "Dashboard",
            icon: Home,
            href: `/${params.storeId}`,
        },
        {
            title: "Billboards",
            icon: Presentation,
            href: `/${params.storeId}/billboards`,
        },
        {
            title: "Categories",
            icon: Layers3,
            href: `/${params.storeId}/categories`,
        },
        {
            title: "Sizes",
            icon: Ruler,
            href: `/${params.storeId}/sizes`,
        },
        {
            title: "Colors",
            icon: Palette,
            href: `/${params.storeId}/colors`,
        },
        {
            title: "Products",
            icon: Package,
            href: "/products",
        },
        {
            title: "Orders",
            icon: ShoppingCart,
            href: "/orders",
        },
    ];


    return (
        <aside className="fixed inset-y-0 left-0 z-10  w-14 flex-col border-r bg-background flex">
            <nav className="flex flex-col items-center gap-4 px-2 py-4">
                <Link
                    href="#"
                    className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground"
                >
                    <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                    <span className="sr-only">BSales</span>
                </Link>

                {routes.map((route, index) => (
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
                            <Link
                                href={route.href}
                                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${pathName === route.href
                                    ? "bg-accent text-accent-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <route.icon className="h-5 w-5" />
                                <span className="sr-only">{route.title}</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">{route.title}</TooltipContent>
                    </Tooltip>
                ))}
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href={`/${params.storeId}/settings`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <Settings className="h-5 w-5" />
                            <span className="sr-only">Settings</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
            </nav>
        </aside>
    )
}
