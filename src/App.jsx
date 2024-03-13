import { useState } from 'react'
import Select from './components/select/select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import './App.css'

let data = [
  {
    label:'First Name',
    value:'first_name',
    selected: false,
    pos:0,
    trait:'user'
  },
  {
    label:'Last Name',
    value:'last_name',
    selected: false,
    pos:0,
    trait:'user'
  },
  {
    label:'Gender',
    value:'gender',
    selected: false,
    pos:0,
    trait:'user'
  },
  {
    label:'Age',
    value:'age',
    selected:false ,
    pos:0,
    trait:'user'
  },
  {
    label:'Account Name',
    value:'account_name',
    selected: false,
    pos:0,
    trait:'group'
  },
  {
    label:'City',
    value:'city',
    selected: false,
    pos:0,
    trait:'group'
  },
  {
    label:'State',
    value:'state',
    selected: false,
    pos:0,
    trait:'group' 
  }
]

function App() {

  let [options, setOptions] = useState(data) //maintain the options
  let [selectedOption, setSelectedOption] = useState('') //capture the selected option on 'Add the segment' button
  let [selectedCount, setSelectedCount] = useState(0) //maintain count of selected items
  let [segment, setSegment] = useState('') //capture the segment name
  let [form, setForm] = useState(false) //control the form display

  //filter and sort the selected options
  let selectedOptions = options.filter((option)=>option.selected===true)
  selectedOptions.sort((a,b)=>a.pos - b.pos) 

  function handleAddNewSchema() {
    if (selectedOption==='NA' || selectedOption==='') return
    setOptions((options)=>{
    let updateOptionIndex = options.findIndex((option)=>option.value===selectedOption)
     return [...options.slice(0,updateOptionIndex),
      {...options[updateOptionIndex], selected:true, pos:selectedCount},
      ...options.slice(updateOptionIndex+1,options.length) ]
   })
    setSelectedCount((prev)=>prev+1)
  }

  function handleSelectedChange(curr_value, new_value, pos) {
    
    setOptions((options)=>{

      let updateOptionIndex = options.findIndex((option)=>option.value===new_value)
      let updateOption = {...options[updateOptionIndex]}
      updateOption.selected = true 
      updateOption.pos = pos
 
      let currentOptionIndex = options.findIndex((option)=>option.value===curr_value)
      let currentOption = {...options[currentOptionIndex]}
      currentOption.selected = false 
      currentOption.pos = 0

      if (updateOptionIndex < currentOptionIndex) {
  
        return [...options.slice(0,updateOptionIndex), 
          updateOption, 
          ...options.slice(updateOptionIndex+1, currentOptionIndex), 
        currentOption,
      ...options.slice(currentOptionIndex+1, options.length)]
       }
       else {
    
        return [...options.slice(0,currentOptionIndex), 
          currentOption, 
          ...options.slice(currentOptionIndex+1, updateOptionIndex), 
        updateOption,
      ...options.slice(updateOptionIndex+1, options.length)]
       }


      }
    )
  
  }

  function unselectOption(value) {

   setOptions((options)=>{
    let updateOptionIndex = options.findIndex((option)=>option.value===value)
    let updateOption = {...options[updateOptionIndex]}
    let temppos = updateOption.pos
    updateOption.selected = false
    updateOption.pos = 0

    let newOptions = [...options]
  
    options.map((option, index)=>{
        if (option.selected && option.pos > temppos)
        newOptions[index] = {...newOptions[index], pos:option.pos-1}
      })

    return [...newOptions.slice(0,updateOptionIndex),
        updateOption,
        ...newOptions.slice(updateOptionIndex+1,newOptions.length)]

   })

  setSelectedCount(prev=>prev-1)

  }

  async function handleSubmit() {
    let output = options.filter((option)=>option.selected===true).map((option)=>{return {[option.value]:option.label}})
    try {
      let result = await fetch('https://webhook.site/f9639cfb-33f5-43f4-8e9a-3503af46500d', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "segment_name": segment,
          "schema": output
        }),
        mode: 'no-cors'
      })
      handleCancel()
    } catch (err) {
      console.log(err)
    }
    
  }

  function handleCancel(){
    setOptions(data)
    setSegment('')
    setSelectedOption('')
    setSelectedCount(0)
  }

  let unselectedoptions = options.filter((option)=>option.selected===false)

  return (
    <div className='overlay'>
    {!form && <button className='formsegment' onClick={()=>{setForm(true)}}>Save segment</button>}
    {form && <div className='content'>
    <div>
    <header className='header'>
      <div className='center header-arrow-icon'>
      <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
      </div>
      <h5>Saving Segment</h5>
    </header>
    <section className='segment'>
      <p>Enter the Name of the Segment</p>
      <input placeholder='Name of the segment' value={segment} onChange={(e)=>{setSegment(e.target.value)}}></input>
      <p>To save your segment, you need to add the schemas to build the query</p>
      <div className='segment-flex'>
        <div className='center'>
          <div className='green circle'></div>
          <p>-User Traits</p>
        </div>
        <div className='center'>
          <div className='red circle'></div>
          <p>-Group Traits</p>
        </div>
      </div>
    </section>

    {selectedOptions.map((option, index)=><Select key={option.value} 
    trait={option.trait}
    firstOption={option} 
    options={unselectedoptions} 
    handleSelectedChange={handleSelectedChange}
    unselectOption={unselectOption}></Select>)}
    <Select key={'Add schema'} trait='white' options={unselectedoptions} setSelectedOption={setSelectedOption}></Select>
    <button className='schemabutton' onClick={handleAddNewSchema}>+Add new schema</button>

    </div>
    <div className='flex'>
    <button className='savesegment' onClick={handleSubmit}>Save segment</button>
    <button className='cancelsegment' onClick={handleCancel}>Cancel</button>
    </div>
    </div>}
    </div>
  )
}

export default App
