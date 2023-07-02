import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { SelectButton } from 'primereact/selectbutton';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import axios from 'axios';

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import './addpill.css';

function Addpill() {
    const [name, setName] = useState('');
    const [dose, setDose] = useState(null);
    const [frequency, setFrequency] = useState(null);
    const [duration, setDuration] = useState(null);
    const [administration, setAdministration] = useState('');
    const [date, setDate] = useState(null);
    const [info, setInfo] = useState('');
    const [dispenser, setDispenser] = useState(null);
    //const [quantity, setQuantity] = useState(null);

    const isDisabled = !name || !dose || !dispenser || !frequency || !duration || !date; //|| !quantity;

    const dispenserOptions = [
        {name: 'Dispenser 1', value: '1'},
        {name: 'Dispenser 2', value: '2'},
        {name: 'Dispenser 3', value: '3'},
    ];

    const handleAdd = () => {
        const data = {
            "name": name,
            "dose": dose,
            "frequency": frequency,
            "dispenser": dispenser,
            "info": info,
            "duration": duration,
            "date": date,
            "administration": administration,
            //"quantity": quantity
        }

        axios.post('http://192.168.1.96:5000/api/data', data)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });

        setName('');
        setDose(null);
        setDispenser(null);
        setInfo('');
        setFrequency(null);
        setDuration(null);
        setDate(null);
        setAdministration('');
        //setQuantity(null);
    }


    return (
        <div className='addpill-container'>
            <div>
                Medicine name:*
                <div>
                    <span className="p-float-label">
                        <InputText id="name" value={name} onChange={(e) => setName(e.target.value)}/>
                        <label htmlFor="name">Medicine</label>
                    </span>
                </div>
            </div>
            <div>
                Dose:*
                <div>
                    <InputNumber inputId="vertical" value={dose} onValueChange={(e) => setDose(e.value)} mode="decimal" showButtons buttonLayout="horitzontal" style={{width: '4rem'}}
                        decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" 
                        min={0} max={20} step={0.5}/>
                </div>
            </div>
            <div>
                Frequency (hours):*
                <div>
                    <InputNumber inputId="vertical" value={frequency} onValueChange={(e) => setFrequency(e.value)} mode="decimal" showButtons buttonLayout="horitzontal" style={{width: '4rem'}}
                        decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" 
                        min={0} />
                </div>
            </div>
            <div>
                Duration (days):*
                <div>
                    <InputNumber inputId="vertical" value={duration} onValueChange={(e) => setDuration(e.value)} mode="decimal" showButtons buttonLayout="horitzontal" style={{width: '4rem'}}
                        decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" 
                        min={0}/>
                </div>
            </div>
            <div>
                Administration comments:
                <div>
                    <span className="p-float-label">
                        <InputText id="administrartion" value={administration} onChange={(e) => setAdministration(e.target.value)} />
                        <label htmlFor="administrartion">Administration</label>
                    </span>
                </div>
            </div>
            <div>
                Starting date:*
                <div>
                    <Calendar id="icon" value={date} minDate={new Date()} onChange={(e) => {setDate(e.value)}} showIcon/>
                </div>
            </div>
            <div>
                Extra info:
                <div>
                    <span className="p-float-label">
                        <InputTextarea id="info" value={info} onChange={(e) => setInfo(e.target.value)} rows={4} cols={40} autoResize/>
                        <label htmlFor="info">Write here extra information needed</label>
                    </span>
                </div>
            </div>
            <div>
                Dispenser:*
                <div>
                    <SelectButton value={dispenser} options={dispenserOptions} onChange={(e) => setDispenser(e.value)}  optionLabel="name" />
                </div>
            </div>
            {/*
            <div>
                Quantity added to the dispenser:*
                <div>
                    <InputNumber inputId="vertical" value={quantity} onValueChange={(e) => setQuantity(e.value)} mode="decimal" showButtons buttonLayout="horitzontal" style={{width: '4rem'}}
                        decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" 
                        min={0}/>
                </div>
            </div>
            */}
            <div>
                <Button label="Add" onClick={handleAdd} disabled={isDisabled}/>
            </div>
        </div>
    );
}

export default Addpill;