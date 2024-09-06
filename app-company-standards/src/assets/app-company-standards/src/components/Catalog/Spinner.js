import React from "react";
import { Loading } from "@insight/toolkit-react";

export default function Spinner(props) {
  return (
    <div className="o-grid__item u-1/1">
      <div className='o-grid'>
        <div className='o-grid__item o-grid__item--center u-text-center'><Loading {...props} /></div>
      </div>
    </div>
  )
}