import { Box, HStack, Heading, Text, Badge } from '@chakra-ui/react';
import RatingGraph from './RatingGraph';
import CommentSection from './CommentSection';
import axios from 'axios';
import { useState, useEffect } from 'react';

const baseURL = process.env.REACT_APP_BASE_URL;

async function getStatistics(experienceID) {
  return axios.get(`${baseURL}/experience/performance`, {
    params: { experienceID },
  });
}

export default function Performance({ experienceData }) {
  const [statistics, setStatistics] = useState([]);
  useEffect(() => {
    if (experienceData.objectId) {
      getStatistics(experienceData.objectId).then((res) =>
        setStatistics(res.data),
      );
    }
  }, [experienceData]);
  return (
    <Box>
      <Information />
      <Box mt="20px">
        {statistics.map((statistic) => {
          return (
            <Box shadow="md" mt="40px" width="100%" justifySelf="center">
              <Box width="100%" display="flex" justifyContent="center">
                <Badge fontSize="1.2em" colorScheme="purple">
                  {statistic.displayText}
                </Badge>
              </Box>
              <Box display="flex" alignItems="center" width="100%">
                <Box width="50%" padding="0% 4%">
                  <RatingGraph data={statistic.reviewSection} />
                </Box>
                <Box width="50%">
                  <CommentSection data={statistic.reviewSection} />
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
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
            Statistics
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
