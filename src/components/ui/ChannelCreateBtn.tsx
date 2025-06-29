"use client"

import { useState, useEffect } from "react"
import { Plus } from "flowbite-react-icons/outline"
import ChannelCreateModal from "@/components/project/chat/ChannelCreateModal"
import { createPortal } from "react-dom"

export default function CreateChannelButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  return (
    <>
      <button
        type="button"
        className="flex items-center justify-between bg-point-color-indigo text-white px-3 py-2 rounded-lg mx-auto w-full hover:bg-point-color-indigo-hover active:scale-95 transition-all duration-200 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <span className="text-sm">채널 추가</span>
        <Plus className="h-5 w-5" />
      </button>
      {mounted && isModalOpen && createPortal(
        <ChannelCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />,
        document.body
      )}
    </>
  )
}