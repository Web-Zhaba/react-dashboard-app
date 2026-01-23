import { useState } from "react";
import Modal from "./Modal";
import './modal-main.css'
import { MdClose } from 'react-icons/md';
import ModalWidget from "./ModalWidget";
import { MdDashboardCustomize, MdCurrencyExchange, MdDewPoint } from "react-icons/md";
import { TbBlockquote } from "react-icons/tb";

export default function MainModal({ className, onAddWidget }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    function openModal() {
        setIsModalOpen(true)
    }

    const handleAddWidget = (widgetType) => {
        if (onAddWidget) {
            onAddWidget(widgetType);
        }
        setIsModalOpen(false); // Закрываем модальное окно после добавления
    };

    return (
        <section>
            <button className={className} onClick={openModal}><MdDashboardCustomize /> Добавить виджет</button>
            <Modal open={isModalOpen}>
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <p className="modal-title">Список виджетов</p>
                            <button onClick={() => setIsModalOpen(false)} className="close-button"><MdClose size={30} /></button>
                        </div>
                        <div className="modal-content">
                            <div className="modal-widget-grid">
                                <ModalWidget 
                                name={<p><MdDewPoint /> Прогноз погоды</p>}
                                description={'Позволяет узнать прогноз погоды на сегодня'}
                                onAdd={() => handleAddWidget('weather')}
                                />

                                <ModalWidget 
                                name={<p><TbBlockquote /> Случайная цитата</p>}
                                description={'Выводит случайную цитату и её автора'}
                                onAdd={() => handleAddWidget('quotes')}
                                />

                                <ModalWidget 
                                name={<p><MdCurrencyExchange /> Курсы валют</p>}
                                description={'Показывает курс валют к рублю на сегодня'}
                                onAdd={() => handleAddWidget('currency')}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </section>
    )
}
