import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Modal,
} from "@chakra-ui/react";
import React from "react";

interface MyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCentered: boolean;
  header: string;
  body: string;
}

export const MyModal: React.FC<MyModalProps> = ({
  isOpen,
  onClose,
  isCentered,
  header,
  body,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={isCentered}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="lg" fontWeight="bold" textAlign="center">
          {header}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="center">{body}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
