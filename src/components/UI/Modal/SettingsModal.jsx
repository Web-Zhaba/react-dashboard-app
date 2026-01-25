import { useState } from "react";
import Modal from "./Modal";
import './modal-main.css'
import { MdClose } from 'react-icons/md';
import ModalWidget from "./ModalWidget";
import NewsSettings from "../../Widgets/NewsWidget/NewsSettings";

export default function SettingsModal({}) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    function openModal() {
        setIsModalOpen(true)
    }

    return (
        <Modal open={isModalOpen}>
            <NewsSettings />
        </Modal>
    )
}