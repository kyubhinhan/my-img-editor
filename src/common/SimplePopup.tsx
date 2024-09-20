'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import ErrUtil from '../common/ErrUtil';
import { useMemo } from 'react';

type PropsType = {
  visible: boolean;
  title: string;
  message: string;
  buttons: ButtonProps[];
  onButtonClick: Function;
};

type ButtonProps = 'ok' | 'delete' | 'cancel' | 'close';

export type { ButtonProps };

export default function SimplePopup({
  visible,
  title,
  message,
  buttons,
  onButtonClick,
}: PropsType) {
  const cButtons = useMemo(() => {
    return buttons.map((preset) => {
      const button = {
        id: preset,
        text: '',
        color: 'default' as 'default' | 'primary' | 'danger',
        onClick: () => {
          onButtonClick(preset);
        },
      };

      if (preset == 'ok') {
        button.text = '확인';
        button.color = 'primary';
      } else if (preset == 'delete') {
        button.text = '삭제';
        button.color = 'danger';
      } else if (preset == 'cancel') {
        button.text = '취소';
      } else if (preset == 'close') {
        button.text = '닫기';
      } else {
        ErrUtil.assert(false);
      }

      return button;
    });
  }, [buttons, onButtonClick]);

  return (
    <Modal
      isOpen={visible}
      onOpenChange={(isOpen) => {
        onButtonClick();
      }}
    >
      <ModalContent>
        <ModalHeader className="text-black">{title}</ModalHeader>
        <ModalBody className="text-black">
          <p>{message}</p>
        </ModalBody>
        <ModalFooter>
          {cButtons.map((button) => (
            <Button
              key={button.id}
              color={button.color}
              onClick={button.onClick}
            >
              {button.text}
            </Button>
          ))}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
