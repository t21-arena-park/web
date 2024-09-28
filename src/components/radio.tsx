import * as React from 'react'

import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useState } from 'react';
export interface TextareaProps
extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onValueChange: (
    value: string,
    questionId: number,
    sectionId: number
  ) => void;
  
  questionId: number;

  sectionId: number;

  defaultValue: string;
}


export const RadioComponent = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
        questionId,
        sectionId,
        onValueChange,
        defaultValue
    },
    ref
  ) => {
    const setFalse = () => {
        onValueChange("false", questionId, sectionId);
        setSelectedOption(false);
    };
    const setTrue = () => {
        onValueChange("true", questionId, sectionId);
        setSelectedOption(true);
    };

    const isButtonSelected = (valor: string) => {
        if (valor == "false") {
            return false;
        } else {
            return true;
        }
    };
    
    const [selectedOption, setSelectedOption] = useState(isButtonSelected(defaultValue));
    
    return (
        <FormControl>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
        >
          <FormControlLabel checked={selectedOption === true} value={true} control={<Radio />} label="Sim" onChange={setTrue}/>
          <FormControlLabel checked={selectedOption === false} value={false} control={<Radio />} label="Não" onChange={setFalse}/>
        </RadioGroup>
      </FormControl>
    )
  })

RadioComponent.displayName = "Radio";