import React from 'react';
import './App.css';


class AllThingsTrackerApp extends React.Component {
	constructor(props) {
  	super(props);
    this.state = {
    	processing: false,
      confirming: false,
      failing: false,
      activebutton: {},
    	buttonz : [
      	{field: "weight", fieldtext: "Weight", values:["lbs"], notes: true},
      	{field: "temperature", fieldtext: "Temp", values:["ºF"], notes: true},
      	{field: "bloodpressure", fieldtext: "BP", values:["systolic","diastolic"], notes: true},
      	{field: "stopfasting", fieldtext: "ended fast", values:[], notes: false},
      	{field: "dietcoke", fieldtext: "diet coke", values:[], notes: false},
      	{field: "coffee", fieldtext: "coffee", values:[], notes: false},
      	{field: "redbull", fieldtext: "redbull", values:[], notes: false},
      	{field: "ate", fieldtext: "ate something", values:[], notes: true},
      	{field: "drank", fieldtext: "drank something", values:[], notes: true},
      	{field: "timetracking", fieldtext: "Time Tracking", values:[], notes: true},
      	{field: "other", fieldtext: "Something else", values:["what happened?"], notes: true},
      	{field: "ailment", fieldtext: "ailment", values:["what's wrong?"], notes: true},
      	{field: "startfasting", fieldtext: "start fast", values:[], notes: false},
      ]
    }
    // bind toggleActive and anything else
    this.confirmPost = this.confirmPost.bind(this);
    this.changeActive = this.changeActive.bind(this);
    this.submitThatShit = this.submitThatShit.bind(this);
    this.timerID = null;
  }
  
  
  confirmPost() {
    this.timerId = setTimeout(() => {
      this.setState({ confirming: false });
       this.timerId = null;
    }, 1000);
  }
  
  changeActive(e,idx) {
  	e.stopPropagation()
  	if( idx===-1 || this.state.activebutton.field===this.state.buttonz[idx].field) {
    	this.setState({activebutton: {}});
    } else {
    	this.setState({activebutton: this.state.buttonz[idx]});
    }
  }
  
  submitThatShit(e) { 
  	e.preventDefault();
  	e.stopPropagation(); 
  	this.setState({processing: true});
    const form = document.querySelector("#form");
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzTW-texocnc3BdLC02ZmED9Z1wuKBnRroHLNoWTF4IP2Bi8zFHJmmJHxd0zUUu1iFslw/exec';
    
    let requestBody = new FormData(form);
    fetch(scriptURL, { method: 'POST', body: requestBody})
      .then(response => {
      console.log('Post successful!');
      this.setState({processing: false, activebutton: {}, confirming: true},this.confirmPost);
      })
      .catch(error => {
      console.log('Error!');
      console.log(error.message);
      this.setState({processing: false});
    })
  }
  
  render() {
  	let ab = this.state.activebutton;
  	let af = "";
    if (Object.keys(ab).length>0) { af=ab.field; }
    return (
    	<div onClick={(e)=>this.changeActive(e,-1)}>
        {this.state.buttonz.map( (item, idx) => (
        <ButtonMk1 key={idx} butidx={idx} but={item} active={item.field===af} activateCallback={this.changeActive} />
        ))}
        { af==="" ? "" : (
          <ActualFormsy actBut={this.state.activebutton} submitCallback={this.submitThatShit} processing={this.state.processing} />
        )}
        { this.state.confirming ? 
          (<div id="submitterbit"><button id="successbutton">Success!</button></div>) : ""
        }
    	</div>
    )
  }
}

function ButtonMk1(props) {
	return (
  	<div>
        <button className={props.active ? "active" : "inactive"} type="button" onClick={(e)=>props.activateCallback(e,props.butidx)} >{props.butidx}. {props.but.fieldtext}</button>
    </div>
  )
}

// method="POST" action="https://script.google.com/macros/s/AKfycbzTW-texocnc3BdLC02ZmED9Z1wuKBnRroHLNoWTF4IP2Bi8zFHJmmJHxd0zUUu1iFslw/exec" >
function ActualFormsy(props) {
	return (
  	<div id="submitterbit" onClick={(e)=>{e.stopPropagation()}}>
      <form id="form"> 
        <p><input readOnly name="type" type="text" value="testing" required /></p>
        <p><input readOnly name="date" type="text" value={new Date()} required /></p>
        <p><input readOnly name="field" type="text" value={props.actBut.fieldtext} required /></p>
        {
        props.actBut.values.map( (val,idx)=> 
          (<p key={"p"+idx}><input key={idx} name={"value_"+(idx+1)} type="text" placeholder={val} autoFocus /></p>)
         )
        }
        <button onClick={(e)=>props.submitCallback(e)}>{props.processing ? "Processing..." : "Post"}</button>
        {props.actBut.notes ? 
        	<p><input name="notes" type="text" placeholder="Notes..."  /></p> : ""
        }
      </form>
  	</div>
  )
}


export default AllThingsTrackerApp;
