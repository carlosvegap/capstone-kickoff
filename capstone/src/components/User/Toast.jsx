// Show toast value
export default function callToast({ toast, title, description, status }) {
  if (status === 'success' || status === 'warning') {
    return toast({
      title,
      description,
      status,
      duration: 2000,
      isClosable: true,
    });
  }
  return toast({
    title: title ?? 'An error happened',
    description: description ?? 'Please try again later',
    status,
    duration: 2000,
    isClosable: true,
  });
}
