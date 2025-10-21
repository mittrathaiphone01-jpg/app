// components/ui/TableDropdown.tsx
'use client';

import { Fragment, useEffect } from 'react';
import { Menu, Transition, MenuButton, MenuItem, MenuItems, Portal } from '@headlessui/react';
import { MenuIcon } from '../Layouts/header/icons';
import { PencilSquareIcon, TrashIcon } from '@/assets/icons';
import { useSession } from 'next-auth/react';



type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function TableDropdown({ onEdit, onDelete }: Props) {

  const { data: session, status } = useSession()

  useEffect(() => {
    if (status !== "authenticated") {
      console.log('no session');
      return

    }
  }, [status, session])

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="flex items-center rounded-full  text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          <span className="sr-only">Open options</span>
          <MenuIcon className="h-5 w-5" aria-hidden="true" />
        </MenuButton>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Portal>
          <MenuItems anchor="bottom end" className="absolute right-0 z-10 mt-2 w-32 origin-top-right divide-y divide-dark-8 dark:divide-dark-5  rounded-md bg-white dark:bg-dark-3 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={onEdit}
                    className={`${focus ? 'bg-dark-8 text-dark-2 dark:text-dark-3' : 'text-dark-4 dark:text-dark-8'
                      } group flex w-full items-center px-4 py-2 text-sm`}
                  >
                    <PencilSquareIcon
                      className="mr-3 h-5 w-5 text-dark-6 dark:text-dark-8 group-hover:text-dark-4"
                      aria-hidden="true"
                    />
                    แก้ไข
                  </button>
                )}
              </MenuItem>
            </div>


            {session?.user.role_id === 1 && (
              <div className="py-1">
                <MenuItem>
                  {({ focus }) => (
                    <button
                      onClick={onDelete}
                      className={`${focus ? 'bg-dark-8 text-dark-2 dark:text-dark-3' : 'text-dark-4 dark:text-dark-8'
                        } group flex w-full items-center px-4 py-2 text-sm`}
                    >
                      <TrashIcon
                        className="mr-3 h-5 w-5 text-dark-6 dark:text-dark-8 group-hover:text-dark-4"
                        aria-hidden="true"
                      />
                      ลบ
                    </button>
                  )}
                </MenuItem>
              </div>
            )}
          </MenuItems>
        </Portal>
      </Transition>
    </Menu>
  );
}