'use client';

import Link from "next/link"
import {
    Home,
    LineChart,
    Package,
    Package2,
    Settings,
    ShoppingCart,
    Users2,
} from "lucide-react"

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathName = usePathname();

    const routes = [
        {
            title: "Dashboard",
            icon: Home,
            href: "/",
        },
        {
            title: "Orders",
            icon: ShoppingCart,
            href: "/orders",
        },
        {
            title: "Products",
            icon: Package,
            href: "/products",
        },
        {
            title: "Customers",
            icon: Users2,
            href: "/customers",
        },
        {
            title: "Analytics",
            icon: LineChart,
            href: "/analytics",
        }
    ];


    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
                <Link
                    href="#"
                    className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
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
                                    } md:h-8 md:w-8`}
                            >
                                <route.icon className="h-5 w-5" />
                                <span className="sr-only">{route.title}</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">{route.title}</TooltipContent>
                    </Tooltip>
                ))}
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
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