// import {
//   Heading,
//   Badge,
//   Button,
//   HStack,
//   Image,
//   VStack,
//   Box,
// } from '@chakra-ui/react';
// import axios from 'axios';
// import { useState, useContext } from 'react';
// import UserContext from '../../../../Contexts/UserContext';
// // import RateExperience from './RateExperience';

// const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
// const baseURL = process.env.REACT_APP_BASE_URL;

// async function getIsRated(username, experienceId) {
//   const values = { username, experienceId };
//   const result = await axios.post(`${baseURL}/review/isRated`, values);
//   return result.data;
// }

// function getPhotoReference(restaurant) {
//   return restaurant.photos ? restaurant.photos[0].photo_reference : null;
// }

// export default function ExperienceInfo({ restaurants }) {
//   const { username } = useContext(UserContext);
//   const [indexRestaurant, setIndexRestaurant] = useState(0);
//   // Get the restaurant viewing now
//   const currentRestaurant = restaurants.length > 0 ? restaurants[indexRestaurant] : null;
//   // let isRated = false;
//   // if (currentRestaurant) {
//   //   isRated = getIsRated(username, currentRestaurant.place_id);
//   // }
//   // console.log(isRated);
//   // console.log(isRated);
//   // find the photo reference of that restaurant
//   const photoReference = currentRestaurant
//     ? getPhotoReference(currentRestaurant)
//     : null;

//   // fetch a photo from the place
//   const photoCall = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${API_KEY}`;

//   function onNext() {
//     if (indexRestaurant < restaurants.length - 1) {
//       setIndexRestaurant(indexRestaurant + 1);
//     }
//   }

//   function onPrevious() {
//     if (indexRestaurant > 0) {
//       setIndexRestaurant(indexRestaurant - 1);
//     }
//   }

//   function onRate(experienceID) {
//     <RateExperience />;
//     console.log('done')
//   }

//   if (currentRestaurant) {
//     return (
//       <VStack>
//         {/* TODO: Deal with different image sizes */}
//         <Image boxSize="250px" src={photoCall} fallbackSrc="https://northernvirginiamag.com/wp-content/uploads/2021/03/restaurant.jpg" mt="20px" borderRadius="30px" alt="restaurant photo" />
//         <HStack justifyContent="center">
//           <Button onClick={onPrevious}>Previous</Button>
//           <Badge>#{indexRestaurant + 1}</Badge>
//           <Button onClick={onNext}>Next</Button>
//         </HStack>
//         <VStack justifyContent="center" display="flex">
//           {/* PLACE IS RATED */}
//           {true && (<Button onClick={() => onRate(currentRestaurant.place_id)}>Rate!</Button>)}
//           <Heading as="h2" size="lg">{currentRestaurant.name}</Heading>
//           <h4>{currentRestaurant.formatted_address}</h4>
//         </VStack>
//       </VStack>
//     );
//   }
// }

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

export default function RateExperience() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
