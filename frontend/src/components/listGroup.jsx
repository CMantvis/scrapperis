import React from 'react'

export default function ListGroup({ items, onItemSelect, selectedItem }) {
    return (
        <ul className="list-group list-group-horizontal">
            {items.map((item, index) => <li
                onClick={() => onItemSelect(item)} key={index}
                className={item === selectedItem ? "list-group-item active" : "list-group-item"}>
                {item}
            </li>)}
        </ul>
    )
}
