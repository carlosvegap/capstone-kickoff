import { Box, HStack, Heading, Text, Badge } from '@chakra-ui/react';
import Graph from './Graph';
import Comment from './Comment';
import axios from 'axios';
import { useState, useEffect } from 'react';

const baseURL = process.env.REACT_APP_BASE_URL;

async function getStatistics(experienceID) {
  return axios.get(`${baseURL}/experience/performance`, {
    params: { experienceID },
  });
}

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
                <Badge fontSize="1.2em" colorScheme="purple">{statistic.displayText}</Badge>
              </Box>
              <Box display="flex" alignItems="center" width="100%">
                <Box width="50%" padding="0% 4%">
                  <Graph data={statistic.reviewSection} determineColor={determineColor} />
                </Box>
                <Box width="50%">
                  <Comment data={statistic.reviewSection} determineColor={determineColor} />
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
