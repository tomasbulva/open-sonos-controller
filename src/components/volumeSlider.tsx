import React, { useRef, useEffect } from "react";
import { Slider, useEventHandler, View, Image } from "@nodegui/react-nodegui";

import volumeMinIconPath from "../../assets/volume-low-bright-full.png";
import volumeMidIconPath from "../../assets/volume-mid-bright-full.png";
import volumeMaxIconPath from "../../assets/volume-high-bright-full.png";

import {
  QAbstractSliderSignals,
  AspectRatioMode,
} from "@nodegui/nodegui";


interface VolumeSliderProps {
  volume?: number;
  setVolume: (volume: number) => void;
}

export default function VolumeSlider(props: VolumeSliderProps) {
  const sliderRef = useRef<any>();
  
  const iconMatrix = [
    {
      min: 0,
      max: 30,
      icon: volumeMinIconPath
    },
    {
      min: 31,
      max: 60,
      icon: volumeMidIconPath
    },
    {
      min: 61,
      max: 100,
      icon: volumeMaxIconPath
    },
  ]

  const volumeStrength = (x:number | undefined): string => {
    if (!x) {
      return iconMatrix[1].icon;
    }

    return iconMatrix.filter((range: {min: number, max: number, icon: string}) => x >= range.min && x <= range.max)[0].icon; 
  }

  const checkHandler = useEventHandler<QAbstractSliderSignals>({
    sliderReleased: () => props.setVolume(sliderRef.current?.value() || 0)
  },[]);

  return (
    <View id="sliderContainer" styleSheet={styleSheet}>
      <Image
        id="icon"
        aspectRatioMode={AspectRatioMode.KeepAspectRatio}
        src={volumeStrength(sliderRef.current?.value())}
      ></Image>
      <Slider
        id="slider"
        minimum={0}
        maximum={100}
        orientation={1}
        value={props.volume}
        on={checkHandler}
        ref={sliderRef}
      />
    </View>
  );
}

const styleSheet = `
  #sliderContainer {
    flex: 1;
    flex-direction: row;
    margin-horizontal: '0px';
    padding-horizontal: '0px';
  }

  #icon {
    width: '40px';
    height: '30px';
    margin-right: '10px';
  }

  #slider {
    flex: 1;
  }
`;
