import { faSubtract } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import './select.css'

export default function Select({trait, options, setSelectedOption, firstOption, handleSelectedChange, unselectOption}) {

  const handleDelete = ()=>{
    if (firstOption) //check if selected
    unselectOption(firstOption.value)
  }

  return (
    <div className="dropdown">
    <div className="center"><div className={`circle ${trait==='user'?'green':'red'} ${firstOption?'':'white'}`}></div></div>

    <select
     onChange={(e)=>{firstOption?handleSelectedChange(firstOption.value, e.target.value, firstOption.pos):setSelectedOption(e.target.value)}} 
     className="select-item" > 
        {firstOption?<option key={firstOption.value} value={firstOption.value}>{firstOption.label}</option>:<option key={'NA'} value={'NA'}>Add schema to segment</option>}
        {options.map((option)=>{
            return (
                <option key={option.value} value={option.value}>{option.label}</option>
            )
        })}
    </select>


    <div onClick={handleDelete}>
    <FontAwesomeIcon
     icon={faSubtract} 
     className="delete-icon"></FontAwesomeIcon>
    </div>
    </div>
  )
}
