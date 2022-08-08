// Show toast value
export default function getToastOptions({ title, description, status }) {
  if (status === 'success' || status === 'warning') {
    return {
      title,
      description,
      status,
      duration: 2000,
      isClosable: true,
    };
  }
  return {
    title: title ?? 'An error happened',
    description: description ?? 'Please try again later',
    status,
    duration: 2000,
    isClosable: true,
  };
}
