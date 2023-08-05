import React from 'react'

function TransparentText(props){
    let text = props.text ? props.text : ""
    let opacity = props.opacity ? props.opacity : 0
    let fill = props.fill ? props.fill : "gold"
    let stroke = props.stroke ? props.stroke : "gold"

    let width = props.width ? props.width : "100%"
    let height = props.height ? props.height : "30"
    let x = props.x ? props.x : "50%"
    let y = props.y ? props.y : "50%"
    let size = props.size ? props.size : "30"

    return <div className="transparent_text">
        <svg width={width} height={height}>
            <text fontSize={size} fill={fill} fillOpacity={opacity} x={x} y={y} dominantBaseline="middle" textAnchor="middle" stroke={stroke}>
                {text}
            </text>
        </svg>
    </div>
}
export default TransparentText