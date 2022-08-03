import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/hooks';
import RateInput from './RateInput';

export default function RateExperience({
  name,
  feedbackAreas,
  onChange,
  onReset,
  onSubmit,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (!isOpen) {
    return (
      <Button onClick={onOpen} colorScheme="green">
        Rate Me!
      </Button>
    );
  }
  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader padding="20px 24px" textAlign="center">
          {name}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {feedbackAreas.map((feedback) => (
            <RateInput
              key={feedback.objectId}
              id={feedback.objectId}
              minValue={feedback.minValue}
              maxValue={feedback.maxValue}
              step={feedback.step}
              defaultValue={feedback.defaultValue}
              feedbackName={feedback.displayText}
              onChange={onChange}
            />
          ))}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              onSubmit();
              onClose();
            }}
          >
            Submit
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              onClose();
              onReset();
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
