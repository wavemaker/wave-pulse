import { UIAgentContext } from "@/hooks/hooks";
import { Modal, ModalHeader, ModalContent, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { useCallback, useContext, useEffect, useState } from "react";

export const SaveDataDialog = (props: {
    isOpen?: boolean,
    onOpen?: Function,
    onClose?: Function
}) => {
    const {isOpen, onOpen, onOpenChange, } = useDisclosure();
    const uiAgent = useContext(UIAgentContext);
    const [name, setName] = useState('');
    const applyFn = useCallback((onClose: Function) => {
        if (name) {
            uiAgent.saveSessionData(name)
                .then(() => onClose && onClose());
        }
    }, [name]);
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
    return (
        <Modal size='sm' isOpen={isOpen} onOpenChange={onOpenChange}>
           <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">Save Session Data As</ModalHeader>
                <ModalBody>
                    <div className="py-2 w-12/12">
                        <Input type="text" label="Enter a name" onValueChange={(v) => setName(v)}/>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" variant="light" onPress={onClose}>Close</Button>
                    <Button color="default" onPress={() => {
                        applyFn(onClose);
                    }}>Apply</Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
    );
};