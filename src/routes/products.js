import React, { useEffect, useState } from "react";

import sendAsync from "../message-control/renderrer";
import {
  Stack,
  Text,
  Input,
  Box,
  Skeleton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import Header from "../components/header";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  IconButton,
  SkeletonCircle,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { UilTrashAlt, UilEdit } from "@iconscout/react-unicons";
import supabase from "../components/supabase";
import ProductAdd from "./product_add";

// Note: `user` comes from the URL, courtesy of our router
const Products = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [itemSelected, setItemSelected] = useState({});

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const getProducts = async () => {
    const response = await sendAsync("SELECT * FROM products");
    setProducts(response);
    setIsLoading(false);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const deleteProduct = async (productId) => {
    if (confirm("Are you sure")) {
      await sendAsync(`DELETE FROM products WHERE id=${productId}`);
      setProducts((old) => old.filter((item) => item.id !== productId));
    }
  };

  return (
    <Stack backgroundColor="#eef2f9" ml="250px" h="100vh">
      <Box
        borderRadius="15px"
        m="40px"
        bgColor="white"
        p="40px"
        boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
      >
        <Stack w="100%" direction="row" justifyContent="space-between">
          <Text fontWeight="bold" fontSize="20px" mb="20px">
            Products
          </Text>
          <Button onClick={onOpen} bgColor="#00d67e" color="white">
            Add Product
          </Button>
        </Stack>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>Name</Th>
              <Th isNumeric>Price</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading && (
              <Tr>
                <Td>
                  <Skeleton>loading</Skeleton>
                </Td>

                <Td>
                  <Skeleton>loading</Skeleton>
                </Td>
                <Td isNumeric>
                  <Skeleton>140</Skeleton>
                </Td>

                <Td>
                  <SkeletonCircle size="10" />
                </Td>
              </Tr>
            )}
            {products?.map((item) => (
              <Tr key={item.id}>
                <Td>{item.id}</Td>
                <Td>{item.name}</Td>
                <Td isNumeric fontWeight="bold">
                  ₹{item.price}
                </Td>
                <Td>
                  <IconButton
                    onClick={() => {
                      setItemSelected(item);
                      onEditOpen();
                    }}
                    mr="10px"
                    borderRadius="full"
                    icon={<UilEdit size="20px" color="green" />}
                  />
                  <IconButton
                    onClick={() => deleteProduct(item.id)}
                    borderRadius="full"
                    icon={<UilTrashAlt size="20px" color="red" />}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Modal
        isOpen={isEditOpen}
        onClose={onEditClose}
        blockScrollOnMount={true}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Product</ModalHeader>
          <ModalCloseButton />
          <ProductAdd
            onClose={onEditClose}
            getProducts={getProducts}
            type="update"
            data={itemSelected}
          />
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        blockScrollOnMount={true}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Product</ModalHeader>
          <ModalCloseButton />
          <ProductAdd
            onClose={onClose}
            type="add"
            getProducts={getProducts}
            data={{ name: "", price: "" }}
          />
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default Products;
