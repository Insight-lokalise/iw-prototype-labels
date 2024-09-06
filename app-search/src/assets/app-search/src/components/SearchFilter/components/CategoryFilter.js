import {Button} from "@insight/toolkit-react";
import React from "react";

export const CategoryFilter = ({ groupKey, setCategory, options }) => {
  return options.map((option, index) => {
    const key = `${groupKey}:${option.val}`
    return (
      <li key={index} className="o-grid__item u-1/1">
        <Button
          className='u-text-bold c-category-facet'
          color='inline-link'
          onClick={() => setCategory({ group: groupKey, ...option })}
        >
          {
            option.count
              ? `${option.display || option.val} (${option.count})`
              : `${option.display || option.val}`
          }
        </Button>
      </li>
    )
  })

}
