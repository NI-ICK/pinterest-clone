import * as React from "react"

export function OptionsIcon(props) {
  return (
    <svg viewBox="0 0 32 32" width={ '3rem' } height={ '3rem' } xmlns="http://www.w3.org/2000/svg" {...props} className="optionsIcon">
      <g id="SVGRepo_iconCarrier">
        <defs>
          <style>
            {
              `.cls-1{
              fill:#231f20;
              stroke:#231f20;
              stroke-linecap:round;
              stroke-linejoin:round;
              stroke-width:0.5px
              }`
            }
          </style>
        </defs>
        <g id="more">
          <circle className="cls-1" cx={16} cy={16} r={2} />
          <circle className="cls-1" cx={6} cy={16} r={2} />
          <circle className="cls-1" cx={26} cy={16} r={2} />
        </g>
      </g>
    </svg>
  )
}