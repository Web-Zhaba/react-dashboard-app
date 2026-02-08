import { useState } from "react";
import Modal from "./Modal";
import './modal-main.css'
import { MdClose } from 'react-icons/md';
import ModalWidget from "./ModalWidget";
import { MdDashboardCustomize, MdCurrencyExchange, MdDewPoint } from "react-icons/md";
import { FaNewspaper } from 'react-icons/fa'
import { TbBlockquote } from "react-icons/tb";
import { LuListTodo } from "react-icons/lu";

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
            <button className={className} onClick={openModal}>
                <MdDashboardCustomize className="text-base sm:text-lg" /> 
                <span className="hidden sm:inline">Добавить виджет</span>
                <span className="sm:hidden">Добавить</span>
            </button>
            <Modal open={isModalOpen}>
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <p className="modal-title">Список виджетов</p>
                            <button onClick={() => setIsModalOpen(false)} className="close-button hover:border-2 hover:border-accent-dark duration-200"><MdClose className="w-5 h-5 sm:w-6 sm:h-6" size={30} /></button>
                        </div>
                        <div className="modal-content">
                            <div className="modal-widget-grid">
                                <ModalWidget 
                                name={
                                <p className="flex items-center justify-center gap-1 sm:gap-2">
                                    <MdDewPoint className="text-lg sm:text-xl"/>
                                    <span className="text-sm sm:text-base">Прогноз погоды</span>
                                </p>}
                                description={'Позволяет узнать прогноз погоды на сегодня'}
                                onAdd={() => handleAddWidget('weather')}
                                />

                                <ModalWidget 
                                name={
                                <p className="flex items-center justify-center gap-1 sm:gap-2">
                                    <TbBlockquote className="text-lg sm:text-xl"/> 
                                    <span className="text-sm sm:text-base">Случайная цитата</span>
                                </p>}
                                description={'Выводит случайную цитату и её автора'}
                                onAdd={() => handleAddWidget('quotes')}
                                />

                                <ModalWidget 
                                name={
                                <p className="flex items-center justify-center gap-1 sm:gap-2">
                                    <MdCurrencyExchange className="text-lg sm:text-xl"/> 
                                    <span className="text-sm sm:text-base">Курсы валют</span>
                                </p>}
                                description={'Показывает курс валют к рублю на сегодня'}
                                onAdd={() => handleAddWidget('currency')}
                                />

                                <ModalWidget 
                                name={
                                <p className="flex items-center justify-center gap-1 sm:gap-2">
                                    <FaNewspaper className="text-lg sm:text-xl"/> 
                                    <span className="text-sm sm:text-base">Новости</span>
                                </p>}
                                description={'Предоставляет список лучших новостей на сегодня'}
                                onAdd={() => handleAddWidget('news')}
                                />

                                <ModalWidget 
                                name={
                                <p className="flex items-center justify-center gap-1 sm:gap-2">
                                    <LuListTodo className="text-lg sm:text-xl"/> 
                                    <span className="text-sm sm:text-base">Список дел</span>
                                </p>}
                                description={'Тут вы можете составлять и изменять список своих задач'}
                                onAdd={() => handleAddWidget('todo')}
                                />                                
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </section>
    )
}
