import './modal-main.css'
import { MdControlPoint } from "react-icons/md";

export default function ModalWidget({name, description, onAdd}) {
    return (
        <div className='widget-item'>
            <div className="widget-name">{name}</div>
            <p className="widget-description">{description}</p>
            <button className="add-widget-button" onClick={onAdd}><MdControlPoint size={16}/>Добавить</button>

        </div>
    )
}