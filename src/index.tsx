import { Button, ChakraProvider, Stack, Text, defaultSystem } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <ChakraProvider value={defaultSystem}>
    <Stack align="flex-start" gap="4" p="6">
      <Text fontSize="xl" fontWeight="semibold">
        Hello world
      </Text>
      <Button colorPalette="blue">Chakra button</Button>
    </Stack>
  </ChakraProvider>,
);
