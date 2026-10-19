'use client';
import { useCallback, useEffect, useState } from 'react';

export function Field({
  label,
  name,
  type = 'text',
  placeholder = '',
  required = false,
  options,
  wide = false,
  full = false,
  min,
  step,
  disabled = false,
  readOnly = false,
  value,
  onChange,
  helper,
}) {
  return <div className={`field ${wide ? 'wide' : ''} ${full ? 'full' : ''}`}><label htmlFor={name}>{label}{required && <span className="required"> *</span>}</label>{options ? <select id={name} name={name} {...(value === undefined ? { defaultValue: '' } : { value })} onChange={onChange} required={required} disabled={disabled}><option value="">Select {label.toLowerCase()}</option>{options.map(option => <option key={option.value ?? option} value={option.value ?? option}>{option.label ?? option}</option>)}</select> : type === 'textarea' ? <textarea id={name} name={name} placeholder={placeholder} required={required} value={value} onChange={onChange} /> : <input id={name} name={name} type={type} placeholder={placeholder} required={required} min={min} step={step} disabled={disabled} readOnly={readOnly} value={value} onChange={onChange} />}{helper && <span className="helper">{helper}</span>}</div>;
}

export function FormSection({ title, children }) { return <><p className="form-section-title">{title}</p><div className="fields">{children}</div></>; }

export function PatientTestFields({ tests }) {
  const [selectedTestCode, setSelectedTestCode] = useState('');
  const selectedTest = tests.find(test => test.testCode === selectedTestCode);
  const resetSelection = useCallback(() => setSelectedTestCode(''), []);
  const options = tests.map(test => ({
    value: test.testCode,
    label: test.testName,
  }));

  return <>
    <Field
      label="Required test"
      name="testCode"
      options={options}
      required
      value={selectedTestCode}
      onChange={event => setSelectedTestCode(event.target.value)}
    />
    <Field label="Price (PKR)" name="price" type="number" min="0" step="0.01" value={selectedTest?.price ?? ''} disabled helper="Price is set by the selected test" />
    <Field label="Doctor" name="doctor" value={selectedTest?.doctorName ?? ''} disabled helper="Assigned automatically from the selected test" />
    <Field label="Patient status" name="status" options={['Active', 'Pending', 'Completed', 'Inactive']} />
    <ResetHandler onReset={resetSelection} />
  </>;
}

function ResetHandler({ onReset }) {
  useEffect(() => {
    const form = document.getElementById('testCode')?.form;
    if (!form) return undefined;
    form.addEventListener('reset', onReset);
    return () => form.removeEventListener('reset', onReset);
  }, [onReset]);
  return null;
}

export default function RegistrationForm({ children, saveLabel, endpoint }) {
 const [message,setMessage]=useState(''); const [isError,setIsError]=useState(false); const [saving,setSaving]=useState(false);
 async function submitForm(event){event.preventDefault();if(saving)return;setSaving(true);setMessage('');const form=event.currentTarget;const data=Object.fromEntries(new FormData(form).entries());try{const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const result=await response.json().catch(()=>({}));if(!response.ok||!result.success)throw new Error(result.error||`Request failed (${response.status}). Check server logs.`);const generated=result.data?.patientId||result.data?.employeeId||result.data?.serviceId;setMessage(`${result.message}${generated?` ID: ${generated}`:''}`);setIsError(false);form.reset();}catch(error){setMessage(error.message||'Could not save the record. Check the connection and environment variables.');setIsError(true);}finally{setSaving(false);}}
 function resetForm(){setMessage('');setIsError(false);}
 return <form className="form-body" onSubmit={submitForm} onReset={resetForm}>{children}{message&&<p className={`form-message ${isError?'error':''}`} role="status">{message}</p>}<div className="form-actions"><button className="btn" type="reset" disabled={saving}>Clear form</button><button className="btn primary" type="submit" disabled={saving}>{saving?'Saving…':`${saveLabel} →`}</button></div></form>;
}
