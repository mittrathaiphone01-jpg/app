import React, { Fragment } from 'react'
import { Dialog, Transition, TransitionChild , DialogPanel, DialogTitle } from '@headlessui/react'
import { GitHubIcon } from '@/app/profile/_components/icons'
import { CloseIcon } from '@/assets/icons'


type Props = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}


const Dialogs = ({ isOpen, onClose, title, children }: Props) => {
  return (
     <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40  " onClose={onClose}>
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-dark-2 p-6 text-left align-middle shadow-xl transition-all">
                {/* Dialog Header */}
                <div className="flex items-center justify-between">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6  text-dark-2 dark:text-dark-8"
                  >
                    {title}
                  </DialogTitle>
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <CloseIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Dialog Content */}
                <div className="mt-2">
                  {children}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Dialogs