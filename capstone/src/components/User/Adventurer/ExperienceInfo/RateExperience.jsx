import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/hooks';
import RateSlider from './RateSlider';

export default function RateExperience({ name }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (!isOpen) {
    return <Button onClick={onOpen}>Rate!</Button>;
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{name} review</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <RateSlider />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}> Submit</Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
