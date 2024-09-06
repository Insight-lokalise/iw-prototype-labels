import React, {Component, Fragment} from 'react';

import { Field } from '@insight/toolkit-react'

import AppContext from '../../context/AppProvider'
import { delimiterOptions } from '../../constants'
import { optionsMap } from '../../helpers'
import { FieldError, Label } from '@insight/toolkit-react/lib/Form/Components/Decorators'

class DeliveryMethodInfo extends Component {
  constructor(props, context) {
    super(props, context)
    const {
      commodityVersions,
      filesTypes,
      languages,
      region,
      setupDeliveryInfo: { delimiter, finalFileNameTemplate, language },
      unspsc
    } = this.context;
    const delimValue = delimiterOptions.find(delim => {
      return delim.toUpperCase() === delimiter
    }) || 'Select One'
    this.state = {
      defaultFileType: [{text: 'Select One', id: 'Select One'}],
      UNSPCList: [ 'Select One', ...unspsc.substring(1, unspsc.length - 1).split(",")],
      delimValue,
      fileTemplate: !!finalFileNameTemplate? 'CUSTOM' : 'DEFAULT',
      customFileName: finalFileNameTemplate,
      fileNameErrorMsg: ''
    }
    this.context.updateDeliveryFields({'fileTemplate': !!finalFileNameTemplate? 'CUSTOM' : 'DEFAULT'});
  }

  onFileTypeChange = ({currentTarget: fileType}) => {
    this.context.updateDeliveryFields({'fileExtention': fileType.value});
  }

  onDelimiterChange = ({currentTarget: delim}) => {
    this.setState({delimValue: delim.value})
    this.context.updateDeliveryFields({'delimiter': delim.value.toUpperCase()});
  }

  onStatusChange = ({currentTarget: status}) => {
    this.context.updateDeliveryFields({'ignoreMaterialStatus': status.value});
  }

  onUNSPCChange = ({currentTarget: unspc}) => {
    this.context.updateDeliveryFields({'unspscToCategoryVersion': unspc.value});
  }

  onCommodityChange = ({currentTarget: commodity}) => {
    this.context.updateDeliveryFields({'eclassCode': commodity.value});
  }

  onLanguageChange = ({currentTarget: language}) => {
    this.context.updateDeliveryFields({'language': language.value});
  }

  onNameTemplateChange = ({currentTarget}) => {
    this.setState({
      fileTemplate: currentTarget.value,
    });
    this.context.updateDeliveryFields({'fileTemplate': currentTarget.value});
    if(currentTarget.value === "DEFAULT") {
      this.context.updateDeliveryFields({'finalFileNameTemplate': null});
      this.setState({customFileName: null})
    }
  }

  onCustomFileNameChange = ({currentTarget}) => {
    const customFileName = currentTarget.value
    const {fileTemplate} = this.state
    this.setState({customFileName})
    this.context.updateDeliveryFields({'finalFileNameTemplate': customFileName});
    if(fileTemplate === 'CUSTOM' && !customFileName) {
      this.setState({fileNameErrorMsg: 'Custom name required.'})
      return;
    }
  }

  onImageProcessChange = ({currentTarget: process}) => {
    this.context.updateDeliveryFields({'imageProcessing': process.checked});
  }

  onDoubleQuoteChange = ({currentTarget: quote}) => {
    this.context.updateDeliveryFields({'doubleQuote': quote.checked});
  }

  onSpecificationsChange = ({currentTarget: specification}) => {
    this.context.updateDeliveryFields({'specifications': specification.checked});
  }

  onHMCEChange = ({currentTarget: hmce}) => {
    this.context.updateDeliveryFields({'hmce': hmce.checked});
  }


  unspcOptions = () => {
    const {UNSPCList} = this.state
    return UNSPCList ? optionsMap(UNSPCList) : []
  }

  fileTypeOptions = (fileTypes) => {
    const { defaultFileType } = this.state
    const fileList = fileTypes.map((val) => ({ text: val.fileType, id: val.fileType }))
    return defaultFileType.concat(fileList)
  }

  commodityOptions = (version) => {
    return [ { text: 'Select One', id: 'Select One'}, ...version.map((val) => ({ text: val.name, id: val.id }))]
  }

  render() {
    const {
      eclassCode,
      doubleQuote,
      fileExtention,
      hmce,
      imageProcessing,
      ignoreMaterialStatus,
      language,
      specifications,
      unspscToCategoryVersion
    } = this.context.setupDeliveryInfo
    const {
      commodityVersions,
      filesTypes,
      languages,
      region
    } = this.context

    const {delimValue, UNSPCList, fileTemplate, customFileName, fileNameErrorMsg } = this.state
    return (
      <div className="o-grid__item u-margin-bot-large u-2/3@desktop">
        <h4 className="u-margin-bot">Step 1: Configure these fields to specify how you want your catalog to be sent.</h4>

        <label className="c-form__label">File Name</label>
        <Field fieldComponent="Radio" name="file-template-group" checked={fileTemplate === 'DEFAULT'}
            label="Default Name (webgroupname_catalogID_day_hour_min)" value="DEFAULT" handleChange={this.onNameTemplateChange} />
        <Field fieldComponent="Radio" name="file-template-group" checked={fileTemplate === 'CUSTOM'}
            label="Custom name" value="CUSTOM" handleChange={this.onNameTemplateChange} />

        {fileTemplate === 'CUSTOM' &&
         <Fragment>
            <Label id="customFileName" required htmlFor="customFileName">Custom file name</Label>
            <div className="c-form__control c-form__element">
              <input
                type="text"
                className="c-input"
                name="customFileName"
                placeholder="Enter custom file name here..."
                value={customFileName}
                maxLength={100}
                onChange={this.onCustomFileNameChange}
              />
              {fileNameErrorMsg && <FieldError showErrorIcon>{fileNameErrorMsg}</FieldError>}
            </div>
          </Fragment>
         }

        <Field
          fieldComponent="Select"
          name="fileTypes"
          label="File Type:"
          options={this.fileTypeOptions(filesTypes)}
          value={fileExtention}
          handleChange={this.onFileTypeChange}
        />
        {!(fileExtention === 'json') &&
          <Field
            fieldComponent="Select"
            name="delimiter"
            label="Delimiter"
            value={delimValue}
            options={optionsMap(delimiterOptions)}
            handleChange={this.onDelimiterChange}
            />
          }
        <div className='o-grid c-form__element'>
          <div className='o-grid__item'>
            <Field
              fieldComponent="Select"
              name="UNSPC"
              label="UNSPC version"
              value={unspscToCategoryVersion}
              options={this.unspcOptions(UNSPCList)}
              handleChange={this.onUNSPCChange}
            />
          </div>
          {region === 'EMEA' &&
            <div className='o-grid__item'>
              <Field
                fieldComponent="Select"
                name="commodity"
                label="Commodity Versions"
                value={eclassCode}
                options={this.commodityOptions(commodityVersions)}
                handleChange={this.onCommodityChange}
              />
            </div>
          }
        </div>
        <Field
          fieldComponent="Select"
          name="languages"
          label="Languages"
          value={language}
          options={optionsMap(['Select One', ...languages])}
          handleChange={this.onLanguageChange}
        />

        <Field
          fieldComponent="Text"
          name="statusToIgnore"
          label="(optional) Status To Ignore"
          handleChange={this.onStatusChange}
          value={ignoreMaterialStatus || ''}
        />
        <div className="o-grid">
          <div className="o-grid__item">
            <Field
              fieldComponent="Checkbox"
              name="imageProcessing"
              checked={imageProcessing}
              label="Image Processing"
              value="imageProcessing"
              handleChange={this.onImageProcessChange}
            />
          </div>
          <div className="o-grid__item">
            <Field
              fieldComponent="Checkbox"
              name="doubleQuote"
              checked={doubleQuote}
              label="Double Quote"
              value="doubleQuote"
              handleChange={this.onDoubleQuoteChange}
            />
          </div>
          <div className="o-grid__item">
            <Field
              fieldComponent="Checkbox"
              name="specifications"
              checked={specifications}
              label="Specifications"
              value="specifications"
              handleChange={this.onSpecificationsChange}
            />
          </div>
          <div className="o-grid__item">
            <Field
              fieldComponent="Checkbox"
              name="hmce"
              checked={hmce}
              label="HMCE"
              value="hmce"
              handleChange={this.onHMCEChange}
            />
          </div>
        </div>
      </div>
      )
    }
}

DeliveryMethodInfo.contextType = AppContext
export default DeliveryMethodInfo;
