"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_DATA } from "./data";
import { ArrowLeftIcon, ChevronUp } from "./icons";
import { MenuItem, MenuItemList } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";
import { DotIcon } from "@/assets/icons";
import { useSession } from "next-auth/react";
import { GoDot } from "react-icons/go";

export function Sidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const { data: session, status } = useSession();


  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));

    // Uncomment the following line to enable multiple expanded items
    // setExpandedItems((prev) =>
    //   prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    // );
  };

  // const firstRender = useRef(true);

  // useEffect(() => {
  //   if (status !== "authenticated") return;

  //   if (!firstRender.current) return; // อัปเดตแค่ครั้งแรก
  //   firstRender.current = false;

  //   const userRole = Number(session?.user?.role_id);
  //   alert(userRole) // ได้ 2 แต่ เห็นของ ADMIN
  //   NAV_DATA.forEach((section) => {
  //     if (!section.roles.includes(userRole)) return; 
  //     section.items.forEach((item) => {
  //       if (!expandedItems.includes(item.title)) {
  //         toggleExpanded(item.title);
  //       }
  //     });
  //   });
  // }, [pathname, session, status]);



  if (status !== "authenticated") return null;

  const userRole = Number(session?.user?.role_id);

  // กรองเมนูตาม role
  const filteredNav = NAV_DATA.filter(section =>
    section.roles.includes(userRole)
  );


  // ใน UseEffect อย่าลบ *******************************************
  // NAV_DATA.some((section) => {
  //   return section.items.some((item) => {
  //     return item.items.some((subItem) => {
  //       // if (subItem.url === pathname) {
  //       //   if (!expandedItems.includes(item.title)) {
  //       //     toggleExpanded(item.title);
  //       //   }

  //       //   // Break the loop
  //       //   return true;
  //       // }
  //     });
  //   });
  // });

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "max-w-[270px] overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-300 ease-linear dark:border-gray-800 dark:bg-gray-dark",
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
          isOpen ? "w-full" : "w-0",
        )}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="flex h-full flex-col py-6 pl-[25px] pr-[7px]">
          <div className="relative pr-4.5">
            <Link
              href={"/"}
              onClick={() => isMobile && toggleSidebar()}
              className="px-0 py-2.5 min-[850px]:py-0 text-xl text-dark-2 dark:text-dark-8"
            >
              รื่นรมย์มือถือ ขอนแก่น
            </Link>

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute left-3/4 right-4.5 top-1/2 -translate-y-1/2 text-right"
              >
                <span className="sr-only">Close Menu</span>

                <ArrowLeftIcon className="ml-auto size-7" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3 min-[850px]:mt-5">
            {filteredNav.map((section) => (
              <div key={section.label} className="mb-6">
                <h2 className="mb-2 text-sm font-medium text-dark-6 dark:text-dark-5">
                  {section.label}
                </h2>

                <nav role="navigation" aria-label={section.label}>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        {item.items.length ? (
                          <div>
                            <MenuItem
                              isActive={item.items.some(
                                ({ url }) => url === pathname,
                              )}
                              onClick={() => toggleExpanded(item.title)}
                            >
                              <item.icon
                                className="size-6 shrink-0"
                                aria-hidden="true"
                              />

                              <span>{item.title}</span>

                              <ChevronUp
                                className={cn(
                                  "ml-auto rotate-180 transition-transform duration-200",
                                  expandedItems.includes(item.title) &&
                                  "rotate-0",
                                )}
                                aria-hidden="true"
                              />
                            </MenuItem>

                            {expandedItems.includes(item.title) && (
                              <ul
                                className="ml-9 mr-0 space-y-1.5 pb-[15px] pr-0 pt-2"
                                role="menu"
                              >
                                {item.items.map((subItem) => (
                                  <li key={subItem.title} role="none">
                                    <MenuItemList
                                      as="link"
                                      href={subItem.url}
                                      isActive={pathname === subItem.url}
                                      className="flex items-center gap-1"
                                    >
                                   <GoDot />    <span>{subItem.title}</span>
                                    </MenuItemList>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : (
                          (() => {
                            const href =
                              "url" in item
                                ? item.url + ""
                                : "/"
                            // item.title.toLowerCase().split(" ").join("-");

                            return (
                              <MenuItem
                                className="flex items-center gap-3 py-3"
                                as="link"
                                href={href}
                                isActive={pathname.startsWith(href)}
                              >
                                <item.icon
                                  className="size-6 shrink-0"
                                  aria-hidden="true"
                                />

                                <span>{item.title} </span>
                              </MenuItem>
                            );
                          })()
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>

              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
