import './att.css';
import { useState } from 'react';

const scriptURL = 'https://script.google.com/macros/s/AKfycbzTW-texocnc3BdLC02ZmED9Z1wuKBnRroHLNoWTF4IP2Bi8zFHJmmJHxd0zUUu1iFslw/exec';

const buttonz = [
  {field: "weight", fieldtext: "Weight", values:["lbs"], notes: true, groupA: true},
  {field: "temperature", fieldtext: "Temp", values:["ºF"], notes: true, groupA: true},
  {field: "bloodpressure", fieldtext: "BP", values:["systolic","diastolic"], notes: true, groupA: true},
  {field: "ailment", fieldtext: "ailment", values:["what's wrong?"], notes: true, groupA: true},
  {field: "stopfasting", fieldtext: "ended fast", values:[], notes: true, groupA: false},
  {field: "dietcoke", fieldtext: "diet coke", values:[], notes: true, groupA: true},
  {field: "coffee", fieldtext: "coffee", values:[], notes: true, groupA: true},
  {field: "redbull", fieldtext: "redbull", values:[], notes: true, groupA: true},
  {field: "ate", fieldtext: "ate something", values:[], notes: true, groupA: false},
  {field: "drank", fieldtext: "drank something", values:[], notes: true, groupA: false},
  {field: "timetracking", fieldtext: "Time Tracking", values:[], notes: true, groupA: true},
  {field: "other", fieldtext: "Something else", values:["what happened?"], notes: true, groupA: true},
  {field: "startfasting", fieldtext: "start fast", values:[], notes: true, groupA: false}
];


function EventButton({thisButtonIdx,thisButton,isActive,clickCallback}) {
	return (
  	<div>
        <button className={(isActive ? "active " : " ") + (thisButton.groupA ? "groupa" : "")} type="button" onClick={(e)=>clickCallback(e,thisButtonIdx)} >{thisButton.fieldtext}</button>
    </div>
  )
}

function FormToSubmit({actBut,processing,submitCallback}) {
	return (
  	<div id="submitterbit" onClick={(e)=>{e.stopPropagation()}}>
      <form id="form"> 
        <p><input readOnly name="type" type="text" value="testing" required /></p>
        <p><input readOnly name="date" type="text" value={new Date()} required /></p>
        <p><input readOnly name="field" type="text" value={actBut.fieldtext} required /></p>
        {
        actBut.values.map( (val,idx)=> 
          (<p key={"p"+actBut.field+idx}><input key={idx+actBut.field} name={"value_"+(idx+1)} type="text" placeholder={val} autoFocus={idx===0} /></p>)
         )
        }
        {processing ? 
        <button id="postbutton" className="processing" disabled>Processing...</button>
        :
        <button id="postbutton" onClick={(e)=>submitCallback(e)}>Post</button>
        }
        {actBut.notes ? 
        	<p><input name="notes" type="text" placeholder="Notes..."  /></p> : ""
        }
      </form>
  	</div>
  )
}



export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [activeButton, setActiveButton] = useState({});

  function changeActive(e,idx) {
    e.stopPropagation();
    if( idx===-1 || activeButton.field===buttonz[idx].field) {
      setActiveButton({});
    } else {
      setActiveButton(buttonz[idx]);
    }
  }

  function submitThatShit(e) { 
    e.preventDefault();
    e.stopPropagation(); 
    setIsProcessing(true);
    const form = document.querySelector("#form");
    let requestBody = new FormData(form);
    fetch(scriptURL, { method: 'POST', body: requestBody})
      .then(response => {
      console.log('Post successful!');
      setIsProcessing(false);
      setIsConfirming(true);
      setActiveButton({});
      setTimeout(() => {
        setIsConfirming(false);
      }, 1000);
      })
      .catch(error => {
      console.log('Error!');
      console.log(error.message);
      setIsProcessing(false);
    })
  }

  return (
    <div className="App">
      <div onClick={(e)=>(changeActive(e,-1))}>
        {buttonz.map( (item, idx) => (
        <EventButton key={idx} thisButtonIdx={idx} thisButton={item} isActive={item.field===activeButton.field} clickCallback={changeActive} />
        ))}
        { Object.keys(activeButton).length === 0 ? "" : (
          <FormToSubmit actBut={activeButton} submitCallback={submitThatShit} processing={isProcessing} />
        )}
        { isConfirming ? 
          (<div id="submitterbit"><button id="successbutton">Success!</button></div>) : ""
        }
      </div>
      <footer className="App-header">
        <p>
          Edit <code>src/App.js</code> is working.
        </p>
      </footer>
    </div>
  );
}
