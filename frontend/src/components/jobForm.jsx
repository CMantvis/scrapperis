import React from 'react';
import Input from "./input";

export default function JobForm({ onSubmit, type, value, onChange, placeholder, names }) {
    return (
        <form style={{ marginTop: "40px" }} onSubmit={e => onSubmit(e)} className="form-inline justify-content-center">
            <div className="row ">
                <div className="form-group mx-sm-3 mb-2">
                    <Input type={type} value={value}
                        name={names}
                        onChange={onChange}
                        placeholder={placeholder} />
                    <button type="submit" className="btn btn-primary" >Search</button>
                </div>
            </div>
        </form>
    )
}
