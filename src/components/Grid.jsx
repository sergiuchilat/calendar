import React, { useEffect, useState } from "react";
import slotsData from "../data/slots.json";
import working_time from "../data/working_time.json";

export default function Grid({ children }) {
    const [timelineSegments, setTimelineSegments] = useState([]);
    const [slots, setSlots] = useState(slotsData);

    const startTimeOffset = working_time.start.hour * 60 + working_time.start.minute;
    
    const minSegmentHeightPx = 60;

    const padZero = (num) => {
        return num < 10 ? `0${num}` : num;
    }

    const generateTimeSegments = (segmentLength) => {
        const segments = [];
        let time = working_time.start;
        while (time.hour <= working_time.end.hour) {
            segments.push(`${padZero(time.hour)}:${padZero(time.minute)}`);
            time.minute += segmentLength;
            if (time.minute >= 60) {
                time.minute = 0;
                time.hour += 1;
            }
        }

        return segments;
    }

    const calculateSlotTop = (slot, minuteHeighPx) => {
        return (
            slot.start_time.hour * 60 + 
            slot.start_time.minute -
            startTimeOffset
            ) * minuteHeighPx
    }
    
    useEffect(() => {
        
        const minSlotDuration = Math.min(...slots.map(slot => slot.duration))
        const minuteHeighPx = minSegmentHeightPx / minSlotDuration;

        const segments = generateTimeSegments(minSlotDuration)

        if (segments.length) {
            setTimelineSegments(segments);

            setSlots(
                slots.map((slot) => {
                    return {
                        ...slot,
                        top: calculateSlotTop(slot, minuteHeighPx),
                        height: slot.duration * minuteHeighPx
                    }
                }
                )
            )
        }
    }, []);

    // console.log(timelineSegments)

    return <>
        {

            timelineSegments && (
                <div className="grid">
                    <div className="timeline">
                        {timelineSegments.map((time, index) => (
                            <div
                                key={index}
                                className="time-segment"
                                style={{ height: minSegmentHeightPx }}
                            >{time}</div>
                        ))}
                    </div>
                    <div className="slots">
                        {slots.map((slot, index) => (
                            <div
                                key={index}
                                className="slot-item"
                                style={{ height: slot.height, top: slot.top, left: index * 25 }}
                            >
                                <div className="content">
                                    {slot.name} {slot.start_time.hour}:{slot.start_time.minute} ({slot.duration})
                                </div>
                            </div>
                            
                        
                        ))}
                    </div>
                </div>
            )
        }
    </>;
}