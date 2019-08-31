import React from 'react';
import { INFO_CORNER, INFO_GAP_N, INFO_GAP_L, N_FONT_SIZE, CLR_TEXT, CLR_BACKGROUND } from '../Constants';

export function renderHoverView(elem, position, is_link) {
    const { x, y } = position;
    let id = is_link ? `${elem.source}:${elem.target}` : elem.id;
    let gap = is_link ? INFO_GAP_L : INFO_GAP_N;

    // textline padding
    let x_padding = 14;
    let y_padding = 4;

    let visible_fields = Object.keys(elem).filter(key => !(key.substring(0, 1) === "_"));
    let max_chars = Math.max(...visible_fields.map(key => `${key}: ${elem[key]}`.length));
    var line_height = (N_FONT_SIZE + y_padding);
    let bg_height = (visible_fields.length + 1) * line_height;

    // offsets
    let y_offset = gap + bg_height;
    let y_start = y - y_offset + (line_height + y_padding / 2);

    // create text for each field in element
    let text_array = [];
    visible_fields.forEach(function (key, idx) {
        let text = <text
            key={`${id}_text_${key}`}
            x={x} y={y_start + (line_height * idx)}
            textAnchor={"middle"}
            style={{
                fontWeight: "bold",
                fill: CLR_BACKGROUND,
            }}>
            {`${key}: ${elem[key]}`}
        </text>;
        console.log(text);
        text_array.push(text);
    });

    // bg
    let text_width = max_chars * N_FONT_SIZE;
    let x_offset = (text_width / 2) + (x_padding / 2);
    let bg_width = text_width + x_padding;

    let rect = <rect
        key={id + "_bg"}
        x={x - x_offset} y={y - y_offset}
        width={bg_width} height={bg_height}
        rx={INFO_CORNER} ry={INFO_CORNER}
        style={{
            fill: CLR_TEXT,
        }} />

    return [rect, text_array];

}