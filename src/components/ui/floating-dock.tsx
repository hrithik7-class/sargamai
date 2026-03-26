"use client";

import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import {
  AnimatePresence,
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  mobileOnly = false,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
  mobileOnly?: boolean;
}) => {
  return (
    <>
      <FloatingDockMobile items={items} className={mobileClassName} />
      {!mobileOnly && (
        <FloatingDockDesktop items={items} className={desktopClassName} />
      )}
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col items-end gap-3 lg:hidden",
        "bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]",
        className,
      )}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="flex flex-col gap-2"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-[44px] min-w-[44px] h-11 w-11 items-center justify-center rounded-full bg-neutral-500 border border-lavender-600 text-teal shadow-lg hover:bg-lavender-700 active:bg-lavender-600 transition-colors"
                title={item.title}
                onClick={() => setOpen(false)}
              >
                {item.icon}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex min-h-[44px] min-w-[44px] h-11 w-11 items-center justify-center rounded-full bg-neutral-500 border border-lavender-600 text-teal shadow-lg hover:bg-lavender-700 active:bg-lavender-600 transition-colors touch-manipulation"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  const mouseX = useMotionValue(Infinity);
  return (
    <div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden h-16 items-end gap-4 rounded-2xl bg-neutral-500 border border-lavender-600 px-4 pb-3 md:flex",
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer
          key={item.href}
          mouseX={mouseX}
          title={item.title}
          icon={item.icon}
          href={item.href}
        />
      ))}
    </div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
}: {
  mouseX: MotionValue<number>;
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const widthIconTransform = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  const heightIconTransform = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20],
  );

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const widthIcon = useSpring(widthIconTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightIconTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <Link
      ref={ref}
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex aspect-square items-center justify-center rounded-full bg-lavender-700 border border-lavender-600 text-teal overflow-hidden min-w-[40px] min-h-[40px]"
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-500 border border-lavender-600 px-2 py-1 text-xs font-medium text-jet-black shadow-lg"
          >
            {title}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.div
        style={{ width: widthIcon, height: heightIcon }}
        className="flex items-center justify-center"
      >
        {icon}
      </motion.div>
    </Link>
  );
}
