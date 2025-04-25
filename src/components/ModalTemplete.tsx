import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface ModalTempleteProps {
    header: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

export default function ModalTemplete({ header, children, footer, isOpen, onClose }: ModalTempleteProps) {
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-component-background backdrop-blur-sm p-6 text-left align-middle shadow-xl transition-all border border-gray-700/50 flex flex-col max-h-[90vh]">
                  {/* 헤더 섹션 */}
                  <div className="flex justify-between items-start border-b border-gray-700/50 pb-6">
                    {header}
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-white transition-all"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>

                  {/* 내용 섹션 */}
                  <div className="mt-6 space-y-6 overflow-y-auto px-1">
                    {children}
                    {footer && (
                      <div className="border-t border-gray-700/50 pt-6 mt-auto">
                        {footer}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    )
}