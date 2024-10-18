import { UIAgentContext } from "@/hooks/hooks";
import { Modal, ModalHeader, ModalContent, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem, Switch, Input } from "@nextui-org/react";
import { useCallback, useContext, useEffect, useState } from "react";
import {IconImport} from '@/components/icons';
import axios from "axios";


export const Settings = (props: {
    isOpen?: boolean,
    onOpen?: Function,
    onClose?: Function
}) => {
   
    const {isOpen, onOpen, onOpenChange, } = useDisclosure();
    const uiAgent = useContext(UIAgentContext);
    const [isConnected, setIsConnected] = useState(uiAgent.isConnected);
    const applyFn = useCallback((onClose: Function) => {
    }, [isConnected]);
    useEffect(() => {
        if (props.isOpen) {
            onOpen();
        }
    }, [props.isOpen]);
    useEffect(() => {
        if (isOpen) {
            props.onOpen && props.onOpen();
        } else {
            props.onClose && props.onClose();
        }
    }, [isOpen]);
    useEffect(() => {
        setIsConnected(uiAgent.isConnected);
    }, [uiAgent.isConnected]);

    return (
        <Modal size='4xl' isOpen={isOpen} onOpenChange={onOpenChange}>
           <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">Settings</ModalHeader>
                <ModalBody className="min-h-72">
                    <div className="flex flex-row border-b content-center">
                        <div className="flex flex-shrink-0 flex-wrap content-center text-sm font-bold w-6/12 px-4 py-1">
                            Connected To Device
                        </div>
                        <div className="py-2 w-6/12">
                            <Switch isSelected={isConnected} onValueChange={(isSelected) => {
                                setIsConnected(isSelected);
                            }}/>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" variant="light" onPress={onClose}>Close</Button>
                    <Button color="default" onPress={() => {
                        applyFn(onClose)
                    }}>Apply</Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
    );
};