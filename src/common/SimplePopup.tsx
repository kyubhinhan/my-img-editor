'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import ErrUtil from '../common/ErrUtil';

type PropsType = {
  visible: boolean;
  updateVisible: (visible: boolean) => void;
  title: string;
  message: string;
  buttons: ButtonProps[];
};

type ButtonProps = {
  id: string;
  text: string;
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | undefined;
  onClick?: () => void;
};

export default function SimplePopup({
  visible,
  updateVisible,
  title,
  message,
  buttons,
}: PropsType) {
  const onButtonClick = (fn?: Function) => {
    if (fn) {
      fn();
    }
    updateVisible(false);
  };

  return (
    <Modal
      isOpen={visible}
      onOpenChange={(isOpen) => {
        updateVisible(isOpen);
      }}
    >
      <ModalContent>
        <ModalHeader className="text-black">{title}</ModalHeader>
        <ModalBody className="text-black">
          <p>{message}</p>
        </ModalBody>
        <ModalFooter>
          {buttons.map((button) => (
            <Button
              key={button.id}
              color={button.color}
              onClick={() => onButtonClick(button.onClick)}
            >
              {button.text}
            </Button>
          ))}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
