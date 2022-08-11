import { Box, Badge, Text } from '@chakra-ui/react';

const data = [
  { score: 1, comment: ['really bad food'] },
  { score: 2, comment: ['not that bad', 'ok if you are really hungry', 'need more work'] },
  { score: 3, comment: ['can improve but ok'] },
  { score: 4, comment: ['it was ok'] },
  { score: 5, comment: ['my favorite place', 'it changed my life'] },
];

export default function Comment({determineColor}) {
  return data.map((commentSection) => {
    return (
      <Box
        mt="10px"
        width="80%"
        display="flex"
        bg={determineColor(commentSection.score)}
        height="auto"
        padding="10px"
        borderRadius="10px"
      >
        <Box width="20%" display="flex" alignItems="center">
          <Badge>Score: {commentSection.score}</Badge>
        </Box>
        <Box width="80%" display="flex" flexDir="column">
          {commentSection.comment.map((comment) => (
            <Text
              justifySelf="center"
              width="60%"
              alignSelf="center"
              borderRadius="40px"
              textAlign="center"
              bg="RGBA(255, 255, 255, 0.60)"
              m="4px"
            >
              {comment}
            </Text>
          ))}
        </Box>
      </Box>
    );
  });
}
