"use client";

import { UIAgentContext } from "@/hooks/hooks";
import { Modal, ModalHeader, ModalContent, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem, Switch, Input } from "@nextui-org/react";
import { useCallback, useContext, useEffect, useState } from "react";


export const ReloadAlert = (props: {
    isOpen?: boolean,
    onOpen?: Function,
    onClose?: Function
}) => {
   
    const {isOpen, onOpen, onOpenChange, } = useDisclosure();
    const uiAgent = useContext(UIAgentContext);
    const [isConnected, setIsConnected] = useState(uiAgent.isConnected);
    const applyFn = useCallback((onClose: Function) => {
        window.location.reload();
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
        <Modal size='xl' isOpen={isOpen} onOpenChange={onOpenChange}>
           <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">App Disconnected</ModalHeader>
                <ModalBody>
                    <div className="flex flex-row content-center">
                        <div className="flex flex-shrink-0 flex-wrap content-center text-sm w-12/12 py-1">
                            Would you like to try reconnecting to app?
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" variant="light" onPress={onClose}>No</Button>
                    <Button color="default" onPress={() => {
                        applyFn(onClose)
                    }}>Reconnect</Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
    );
};