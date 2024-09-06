/* eslint-disable jsx-a11y/label-has-for */
import React, {useEffect, useContext, useState} from 'react'
import { Button, DatePicker, Field, Locale} from '@insight/toolkit-react'
import AppContext from '../context/AppProvider'
import { timezones, freqOptions, PAGES, min, regions } from '../constants'
import { optionsMap, formatDate } from '../helpers'


export const Occurrences = () => {
  // referencing context and destructuring
  const appContext = useContext(AppContext)
  const {updateOccurrencesInfo, onSelectedTabChange, setupDeliveryInfo: { frequency, timeZoneRegion, scheduledRunTime, timeZone, scheduledStartDate } } = appContext
  
  const [schedule, setSchedule] = useState(
    {
      acceptChecked: false,
      freqSelected: frequency || 'Select One',
      regionSelected: timeZoneRegion || 'Select One',      
      scheduledDate: date || 'Select One',
      timeSelected: scheduledRunTime || '00:00',
      timeZoneSelected: timeZone || 'Select One'
      
    }
  )
  const { freqSelected, regionSelected, timeZoneSelected } = schedule
  

  // handling hours and mins
  const hr = scheduledRunTime.split(':')[0]
  const mn = scheduledRunTime.split(':')[1]
  const [time, setTime] = useState(
    {
      hourSelected: hr.length !== 2 ? `0${hr}` : hr || 'Select One',
      minSelected: mn || 'Select One',
    }
  )
  // using local function as existing helper does not return correct format
  const populateHours = () => {
    const arr = []
    for (let i = 0; i <= 23; i++){
      if (i < 10) {
        arr.push(`0${i}`)
      } else {
        arr.push(`${i}`) 
      }
    }
    return arr;
  }
  const hourOptions = ['Select One', ...populateHours()]
  
  // Converts the date and corrects for timezone offset
  const dateConverter = (scheduledStartDate) => {
    if (scheduledStartDate !== null && scheduledStartDate !== "") {
      const newDate = new Date(scheduledStartDate.split(' ')[0])
      const offset = newDate.getTimezoneOffset() * 60000;   
      return new Date(newDate.getTime() + offset)      
      
    } else {
      return new Date()
    }
  }
  // LOCAL STATE MANAGEMENT:
  // convert the recieved date-time stamp into date only
  const [date, setDate] = useState(dateConverter(scheduledStartDate))
   
  const region_obj = regionSelected && regionSelected !== "Select One" ?  timezones[regionSelected].timeZones : {}
  
  
  // and find the name of the current timezone if set   
  const tzName = regionSelected && regionSelected !== "Select One" ? region_obj.find( ({ id }) => id === timeZoneSelected ) : 'Select One'
  
  // get regions from tiomezone constant
  const {NA, EMEA, APAC} = timezones

  // populate timezones dropdowm dynamically based on region
  const populateTimeZones = (region) => ({
    'NA': NA.timeZones,
    'EMEA': EMEA.timeZones,
    'APAC': APAC.timeZones
  })[region]

 // conditional for rendering the 'Continue' button
  
  const disableButton = !freqSelected || freqSelected === 'Select One' || !date || !time || time.hourSelected === 'Select One' || time.minSelected === 'Select One' || regionSelected === 'Select One'

  const timeZoneValue = !tzName || typeof tzName.text === 'undefined' ? "Please Select" : tzName.text
  // handlers
  const handleFieldChange = (field, value) => {    
    setSchedule({
      ...schedule,
      [field]: value
    })
  }
  const handleDateChange = (field, value) => {
    const formatedDate = formatDate(value)
    setSchedule({
      ...schedule,
      [field]: formatedDate
    })
  }
  const handleTimeChange = (field, value) => {
    setTime({
      ...time,
      [field]: value
    })
  }
  const handleTimezoneChange = (field, value) => {
    

    // get the tz id from the timezones constant
    const region = timezones[regionSelected].timeZones    
    const tzID = region.find(tz => tz.text === value).id  
    setSchedule({
      ...schedule,
      [field]: value
    })

    // set schedule with tzID else backend will not recognise it
    setSchedule({
      ...schedule,
      [field]: tzID
    })
  }

  // next button click
  const viewNextStep = () => {
    const dateAndTime = `${formatDate(date)} ${schedule.timeSelected}:00`
    schedule.scheduledDate = dateAndTime
    updateOccurrencesInfo(schedule)     
    onSelectedTabChange(PAGES.DELIVERY)
  }


  useEffect(() => {
    // if hours and mins have been selected then...
    if (time.hourSelected !== 'Select One' && time.minSelected !== 'Select One') {
      // ...concatenate hours and mins and
      const selectedTime = `${time.hourSelected}:${time.minSelected}`
      // ...update state
      setSchedule({
        ...schedule,
        timeSelected: selectedTime
      })
    }
  }, [time, schedule.timeSelected])

  return (
    <div>
      <div className="o-grid u-margin-bot">
        <div className="o-grid__item u-1/1">
          <h4>Please choose from the options below for the best time to run the catalog:</h4>
        </div>
      </div>
      <div className="o-grid u-margin-bot">
        <div className="o-grid__item u-2/6" id="frequencyField">
          <Field
            fieldComponent="Select"
            name="frequency"
            label="Frequency:"
            options={optionsMap(freqOptions)}
            value={freqSelected}
            handleChange={e => handleFieldChange("freqSelected", e.target.value)}
          />
        </div>
        <div className="o-grid__item u-2/6" id="dateItem">
          <div className="c-form__element">
            <label className="c-form__label" htmlFor="date">Date</label>
            <div className="c-form__control">
              <Locale value={{ locale: "en_US" }}>
                <DatePicker 
                  selected={date}
                  onChange={selected => {
                  setDate(selected)
                  handleDateChange("scheduledDate", selected)
                  }}
                  id="date"
                />
              </Locale>
            </div>
          </div>
        </div>
        <div className="o-grid__item u-1/6" id="hourItem">
          <Field
            fieldComponent="Select"
            name="hour"
            label="Hour:"
            options={optionsMap(hourOptions)}
            value={time.hourSelected}
            
            handleChange={e => handleTimeChange("hourSelected", e.target.value)}
          />
        </div>
        <div className="o-grid__item u-1/6" id="minItem">
          <Field
            fieldComponent="Select"
            name="minute"
            label="Mins:"
            options={optionsMap(min)}
            value={time.minSelected}
            handleChange={e => handleTimeChange("minSelected", e.target.value)}
          />
        </div>
      </div>

      <div className="o-grid u-margin-bot">
        <div className="o-grid__item u-1/3" id="regionItem">
          <Field
            fieldComponent="Select"
            name="region"
            label="Region:"
            options={optionsMap(regions)}
            value={regionSelected}
            handleChange={e => handleFieldChange("regionSelected", e.target.value)}
          />
        </div>
        <div className="o-grid__item u-1/3" id="timezoneItem">
          <Field
            disabled={regionSelected === 'Select One'}
            fieldComponent="Select"
            name="timezone"
            label="Time Zone:"
            options={populateTimeZones(regionSelected)}            
            value={timeZoneValue}
            handleChange={e => handleTimezoneChange("timeZoneSelected", e.target.value)}
          />
        </div>
        <div className="o-grid__item u-1/3" />
      </div>
      <div className="o-grid">
        <div className="o-grid__item u-1/1">
          <div className="u-text-right">
            <Button color="primary" onClick={viewNextStep} isDisabled={disableButton}>Continue</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Occurrences