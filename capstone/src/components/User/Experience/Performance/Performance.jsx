import { Box, HStack, Heading, Text } from '@chakra-ui/react';
import Graph from './Graph';
import Comment from './Comment';

function determineColor(value) {
  switch (value) {
    case 1:
      return '#E53E3E';
    case 2:
      return '#DD6B20';
    case 3:
      return '#ECC94B';
    case 4:
      return '#68D391';
    case 5:
      return '#38B2AC';
    default:
      return '#0000000';
  }
}

export default function Performance() {
  return (
    <Box>
      <Information />
      <HStack mt="20px">
        <Box width="50%" padding="0% 4%">
          <Graph determineColor={determineColor} />
        </Box>
        <Box width="50%">
          <Comment determineColor={determineColor} />
        </Box>
      </HStack>
    </Box>
  );
}

function Information() {
  return (
    <Box>
      <Heading mt="20px" textAlign="center">
        Welcome, Experience Maker
      </Heading>
      <Text textAlign="center">
        Here you can find your experience performance
      </Text>
      <HStack mt="20px">
        <Box width="50%">
          <Heading size="md" textAlign="center">
            Feedback area
          </Heading>
        </Box>
        <Box width="50%">
          <Heading size="md" textAlign="center">
            Comments
          </Heading>
        </Box>
      </HStack>
    </Box>
  );
}
