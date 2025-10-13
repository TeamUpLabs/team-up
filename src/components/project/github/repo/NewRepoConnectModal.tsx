import { useState } from "react";
import ModalTemplete from "@/components/ModalTemplete";
import GithubRepoConnect from "@/layouts/GithubRepoConnect";
import GithubRepoCreate from "@/layouts/GithubRepoCreate";

interface NewRepoConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewRepoConnectModal({
  isOpen,
  onClose
}: NewRepoConnectModalProps) {
  const [isGithubRepoCreated, setIsGithubRepoCreated] = useState(false);

  return (
    <ModalTemplete header="" isOpen={isOpen} onClose={onClose}>
      {isGithubRepoCreated ? (
        <GithubRepoConnect setIsGithubRepoCreated={setIsGithubRepoCreated} />
      ) : (
        <GithubRepoCreate setIsGithubRepoCreated={setIsGithubRepoCreated} />
      )}
    </ModalTemplete>
  )
}