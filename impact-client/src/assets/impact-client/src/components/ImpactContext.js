import React, { Component } from 'react'
import {configData} from '../data/impact-server'

export const ImpactContext = React.createContext(
    configData.groups[0] // default value
);
