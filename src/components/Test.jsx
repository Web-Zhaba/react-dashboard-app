import { closestCorners } from "@dnd-kit/core";
import { useState, useRef, useEffect } from "react";
import { DndContext } from "react-dnd";


export default function Test() {
    const [tasks, setTasks] = useState([
        {id: 1, title: '1'},
        {id: 2, title: '2'},
        {id: 3, title: '3'},
    ])
    return (
        <h1>пример</h1>
        <DndContext collisionDetection={closestCorners}>

        </DndContext>
    );
}