import React, { useRef, useEffect, useState } from "react";
import { Slider, useEventHandler, View, Image, Button } from "@nodegui/react-nodegui";

import {
  QAbstractSliderSignals,
  AspectRatioMode,
  QIcon,
  QSize,
} from "@nodegui/nodegui";

import volumeMuteIconPath from "../../assets/mute-bright-full.png";
const volumeMuteIcon = new QIcon(volumeMuteIconPath);

import volumeNoneIconPath from "../../assets/volume-none-bright-full.png";
const volumeNoneIcon = new QIcon(volumeNoneIconPath);

import volumeMinIconPath from "../../assets/volume-low-bright-full.png";
const volumeMinIcon = new QIcon(volumeMinIconPath);

import volumeMidIconPath from "../../assets/volume-mid-bright-full.png";
const volumeMidIcon = new QIcon(volumeMidIconPath);

import volumeMaxIconPath from "../../assets/volume-high-bright-full.png";
const volumeMaxIcon = new QIcon(volumeMaxIconPath);


interface VolumeSliderProps {
  volume: number;
  setVolume: (volume: number) => void;
  isMute: boolean;
  mute: () => void;
}

export default function VolumeSlider(props: VolumeSliderProps) {
  const { isMute, mute } = props;

  const sliderRef = useRef<any>();
  
  const iconMatrix = [
    {
      min: 0,
      max: 1,
      icon: volumeNoneIcon
    },
    {
      min: 2,
      max: 30,
      icon: volumeMinIcon
    },
    {
      min: 31,
      max: 60,
      icon: volumeMidIcon
    },
    {
      min: 61,
      max: 100,
      icon: volumeMaxIcon
    },
  ]

  const volumeStrength = (x:number | undefined): any => {
    if (x === undefined) {
      return iconMatrix[1].icon;
    }

    if (props.isMute) {
      return volumeMuteIcon;
    }

    const rangeIcon = iconMatrix.filter((range: {min: number, max: number, icon: any}) => x >= range.min && x <= range.max);
    return rangeIcon[0].icon; 
  }

  const [volume, setVolume] = useState<number>(props.volume);
  const [volumeIcon, setVolumeIcon] = useState<any>(volumeStrength(props.volume));

  useEffect(() => {
    setVolume(props.volume);
    setVolumeIcon({...volumeStrength(props.volume)});
  }, [props.volume, props.isMute])

  const checkHandler = useEventHandler<QAbstractSliderSignals>({
    sliderReleased: () => {
      props.setVolume(sliderRef.current.value());
      setVolumeIcon({...volumeStrength(sliderRef.current.value())});
    }
  },[]);

  return (
    <View id="sliderContainer" styleSheet={styleSheet}>
      <Button
        id="ACBtn"
        icon={volumeIcon}
        iconSize={new QSize(30, 30)}
        on={{ clicked: mute }}
      />
      <Slider
        id="slider"
        minimum={0}
        maximum={100}
        orientation={1}
        value={volume}
        on={checkHandler}
        ref={sliderRef}
        enabled={!props.isMute}
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

  #ACBtn {
    background-color: '#272727';
    border: 3px solid #272727;
    border-radius: '25%';
  }

  #ACBtn:pressed {
    background-color: '#363636';
  }

  #ACBtn:hover {
    background-color: '#363636';
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
