// @ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import {
  ChakraProvider,
  Flex,
  Box,
  Text,
  Button,
  List,
  ListItem,
  Input,
  Heading,
  ListIcon,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState<number | undefined>();
  const [blockTransactions, toggleBlockTransactions] = useState(false);
  const [blockDetails, setBlockDetails] = useState();
  const [singleTransactionInfo, setSingleTransactionInfo] = useState();
  const [requestHash, setRequestHash] = useState("");
  const [balance, setBalance] = useState("");
  const [addressNotFound, setAddressNotFound] = useState(false);

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber()); // .getBlockNumber returns the block number of the most recently mined block
    }

    getBlockNumber();
  }, []);

  useEffect(() => {
    async function getBlockTransactions() {
      setBlockDetails(await alchemy.core.getBlock(blockNumber));
    }
    getBlockTransactions();
  }, [blockNumber]);
  // console.log('blockDetails', blockDetails);

  const handleToggleBlockTransactions = () => {
    toggleBlockTransactions(!blockTransactions);
  };

  const handleTransactionInfo = async (index: string | number) => {
    await alchemy.core
      .getTransactionReceipt(blockDetails?.transactions[index])
      .then(setSingleTransactionInfo);
  };

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequestHash(e.target.value);
  };

  const handleBalance = async () => {
    await alchemy.core
      .getBalance(requestHash)
      .then((balance) => setBalance(balance.toString()))
      .catch(() => setAddressNotFound(true));
  };

  const handleOnKeyPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleBalance();
    }
  };

  const handleGetLatestTransactions = async () =>
    setBlockNumber(await alchemy.core.getBlockNumber());

  return (
    <React.Fragment>
      <Flex>
        <Flex direction="column" w="100vw" p="2">
          <Flex bg="#262525" h="100vh" color="white" justify="center" pt="6">
            <Flex direction="column">
              <Button
                colorScheme="teal"
                variant="solid"
                mb="2"
                onClick={handleGetLatestTransactions}
              >
                Get most recently mined block
              </Button>
              <Box
                bg="chocolate"
                style={{
                  border: "1px solid black",
                  overflowY: "scroll",
                  borderRadius: "15px",
                }}
                w="1100px"
                h="600px"
                align="center"
              >
                <Heading as="h6" mb="4">
                  Block Number: {blockDetails?.number}
                </Heading>
                <Text mb="2">Click to display block transactions:</Text>
                <Button
                  size="md"
                  colorScheme="teal"
                  mb="3"
                  onClick={handleToggleBlockTransactions}
                >
                  {blockDetails?.number}
                </Button>
                <Flex justify="center" align="center">
                  <Text as="b">Parent hash: </Text>
                  <Text>{blockDetails?.parentHash}</Text>
                </Flex>
                <Flex justify="center" mt="5">
                  <List>
                    <Text mb="3">Block transactions:</Text>
                    {blockTransactions
                      ? blockDetails?.transactions?.map(
                          (
                            item: string | undefined,
                            index: React.Key | null | undefined
                          ) => {
                            return (
                              <ListItem key={index}>
                                <ListIcon as={CheckIcon} color="green.500" />
                                <Button
                                  size="sm"
                                  colorScheme="yellow"
                                  mb="1"
                                  onClick={() => handleTransactionInfo(index)}
                                >
                                  {item}
                                </Button>
                              </ListItem>
                            );
                          }
                        )
                      : null}
                  </List>
                </Flex>
              </Box>
              <Flex direction="column" mt="5">
                <Text>
                  Transaction hash: {singleTransactionInfo?.transactionHash}
                </Text>
                <Text mt="3">From: {singleTransactionInfo?.from}</Text>
                <Text mt="3">To: {singleTransactionInfo?.to}</Text>
                <Text mt="3">
                  Confirmations: {singleTransactionInfo?.confirmations}
                </Text>
              </Flex>
              <Heading as="h6" mb="4" mt="10">
                Balance checker:
              </Heading>
              <Text mb="2">Balance: {balance}</Text>
              <Input
                color="teal"
                _placeholder={{ color: "inherit" }}
                placeholder="Type address or ENS to see balance"
                isInvalid={addressNotFound ? "true" : "false"}
                errorBorderColor={addressNotFound ? "crimson" : null}
                onChange={handleInputValue}
                onKeyDown={handleOnKeyPressed}
              />
              addressNotFound
              <Button onClick={handleBalance} colorScheme="green" mb="10">
                Click to see balance
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </React.Fragment>
  );
}

export default App;
