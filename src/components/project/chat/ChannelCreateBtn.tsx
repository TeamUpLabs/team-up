"use client"

import { useState, useEffect } from "react"
import { Plus } from "flowbite-react-icons/outline"
import ChannelCreateModal from "@/components/project/chat/ChannelCreateModal"
import { createPortal } from "react-dom"
import Badge from "@/components/ui/Badge"
import { useTheme } from "@/contexts/ThemeContext"

export default function CreateChannelButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { isDark } = useTheme()

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  return (
    <>
      <Badge
        color="violet"
        content={
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            <span>채널 추가</span>
          </div>
        }
        className="flex !px-3 !py-2 active:scale-95 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
        isDark={isDark}
      />
      {mounted && isModalOpen && createPortal(
        <ChannelCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />,
        document.body
      )}
    </>
  )
}