import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from "primereact/selectbutton";
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import axios from 'axios';

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import './checkpill.css';
import Addpill from './addpill';


function Checkpill() {
  const [people, setPeople] = useState([]);
  const [dispensers, setDispensers] = useState(null);
  const [visible, setVisible] = useState(false);
  const [visibleQuantity, setVisibleQuantity] = useState(false);
  const [visibleDispenser, setVisibleDispenser] = useState(false);

  const selectOptions = [
    {label: 'Morning', value: 'Morning'},
    {label: 'Afternoon', value: 'Afternoon'},
    {label: 'Night', value: 'Night'}
  ];



  /*
    API CALLS 
  */
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/data')
      .then(response => {
        setPeople(response.data.people);
        setDispensers(response.data.dispensers);
      })
      .catch(error => {
          console.error(error);
      });
  }, []);

  const handleRefresh = () => {
    axios.get('http://127.0.0.1:5000/api/data')
      .then(response => {
        console.log(response)
        setPeople(response.data.people);
        setDispensers(response.data.dispensers);
      })
      .catch(error => {
          console.error(error);
      });
  }

  const registerNewFace = () => {
    axios.get('http://127.0.0.1:5000/api/addface')
      .then(response => {
        console.log(response)
      })
      .catch(error => {
          console.error(error);
      });
  }

  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event, newRowData } = e;

    switch (field) {
        case 'quantity':
        case 'price':
            rowData[field] = newValue;
            break;
        case 'startDate':
            rowData[field] = newValue.toLocaleDateString();
            break;

        default:
            rowData[field] = newValue;
            event.preventDefault();
            break;
    }

    console.log(newRowData);
  };

  const cellEditor = (options) => {
    if (options.field === 'dose' || options.field === 'durationDays') return numEditor(options);
    if (options.field === 'startDate') return dateEditor(options);
    if (options.field === 'extraInfo' || options.field === 'administration') return textAreaEditor(options);
    if (options.field === 'frequency') return selectEditor(options);
    else return textEditor(options);
  };

  const selectEditor = (options) => {
    return (
      <SelectButton
        value={options.value}
        options={selectOptions}
        onChange={(e) => options.editorCallback(e.target.value)}
        multiple
      />
    );
  };

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)}/>;
  };

  const dateEditor = (options) => {
    return <Calendar dateFormat="dd/mm/yy" value={options.value} onChange={(e) => options.editorCallback(e.target.value)}/>;
  };

  const textAreaEditor = (options) => {
    return <InputTextarea type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} 
    rows={4} cols={40} autoResize/>;
  };

  const numEditor = (options) => {
      return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} 
      decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" 
      showButtons min={0}/>;
  };

  const handleSelectChange = (rowData, selectedOptions) => {
    rowData.frequency = selectedOptions;
  };



  /*
    SHOW AND HIDE DIALOGS
  */
  const showDialog = () => {
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  const showQuantity = () => {
    setVisibleQuantity(true);
  };

  const hideQuantity = () => {
    setVisibleQuantity(false);
  };

  const showDispenser = () => {
    setVisibleDispenser(true);
  };

  const hideDispenser = () => {
    setVisibleDispenser(false);
  };



  /*
    DELETE OPTIONS - MEDICINE / DISPENSER
  */
  const handleDeleteMedicine = (rowData) => {
    console.log('Eliminar fila:', rowData);
  };

  const actionMedicineTemplate = (rowData) => {
    return <Button icon="pi pi-trash" onClick={() => handleDeleteMedicine(rowData)} className="p-button-danger"/>;
  };

  const handleDeleteDispenser = (rowData) => {
    console.log('Eliminar dispensador:', rowData);
  };
  
  const actionDispenserTemplate = (rowData) => {
    return <Button icon="pi pi-trash" onClick={() => handleDeleteDispenser(rowData)} className="p-button-danger"/>;
  };



  /*
    HTML CODE
  */
  return (
    <div className="checkpill-container">
      <div>
        <div className="buttons">
          <h1>Medicines</h1>
          <Button icon="pi pi-refresh" onClick={handleRefresh}/>
          <Button label="Add new Medication" onClick={showDialog} />
          <Dialog header="Add new Medication" visible={visible} onHide={hideDialog}>
            <Addpill/>
          </Dialog>
          <Button label="Add new Face" onClick={registerNewFace} />
        </div>
        {people.map(person => (
          <div key={person.name}>
            <h2>{person.name}'s Medications:</h2>
            <DataTable value={person.medication} showGridlines>
              <Column field="pillName" header="Medication" editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}/> 
              <Column field="dose" header="Dose" editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}/>
              <Column
                field="frequency"
                header="Frequency"
                editor={(columnOptions) => cellEditor(columnOptions)}
                onCellEditComplete={onCellEditComplete}
                body={(rowData) => (
                  <>
                    {rowData.editing ? (
                      <SelectButton
                        value={rowData.frequency}
                        options={selectOptions}
                        onChange={(e) => handleSelectChange(rowData, e.target.value)}
                        multiple
                      />
                    ) : (
                      <SelectButton
                        value={rowData.frequency}
                        options={selectOptions}
                        disabled
                        multiple
                        selectedItemTemplate={(option) => selectOptions.includes(option) && option.label}
                      />
                    )}
                  </>
                )}
              />
              <Column field="durationDays" header="Duration in Days" editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}/>
              <Column field="administration" header="Administration" editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}/>
              <Column field="startDate" header="Start Date" editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}/>
              <Column field="extraInfo" header="Extra Information" editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}/>
              <Column header="Delete" body={actionMedicineTemplate} style={{ textAlign: 'center', width: '8rem' }}/>
            </DataTable>
          </div>
        ))}
      </div>
      <div>
        <div className="dispenser-buttons">
          <h1>Dispensers</h1>
          <Button label="Add new Quantity" onClick={showQuantity} />
          <Dialog header="Add new Quantity" visible={visibleQuantity} onHide={hideQuantity}>
            {/* WIP */}
          </Dialog>
          <Button label="Edit Dispenser" onClick={showDispenser} />
          <Dialog header="Edit Dispenser" visible={visibleDispenser} onHide={hideDispenser}>
            {/* WIP */}
          </Dialog>
        </div>
        <DataTable value={dispensers} showGridlines>
          <Column field="dispenser" header="Dispenser" />
          <Column field="pillName" header="Medication" editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}/>
          <Column field="quantity" header="Quantity Left" />
          <Column header="Delete" body={actionDispenserTemplate} style={{ textAlign: 'center', width: '8rem' }}/>
        </DataTable>
      </div>
    </div>
  );
}


export default Checkpill;