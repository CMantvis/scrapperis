import React from 'react';

export default function Input({name,value,onChange, placeholder,type,error}) {
    return (
        <div>
            <label htmlFor={name}></label>
            <input 
                value={value}
                onChange={onChange}
                id={name}
                name={name}
                type={type}
                className="form-control"
                placeholder={placeholder}

            />
            { error && <div className="alert alert-danger">{error}</div>}
        </div>
    )
}
