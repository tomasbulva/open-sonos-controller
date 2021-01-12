import { Text, Window, hot, View, BoxView, ScrollArea } from "@nodegui/react-nodegui";
import React from "react";

import { SonosManager, SonosEvents, ServiceEvents } from "@svrooij/sonos";

import { unescape } from "./utils/unescape";
import ErrorBoundary from "./utils/errorBoundary";


import { QIcon, QMainWindow, Direction } from "@nodegui/nodegui";
import nodeguiIcon from "../assets/LSC-bright-outline.png";

import VolumeSlider from "./components/volumeSlider";
import AlbumArtView from "./components/albumArtView";
import TvArtView from "./components/tvArtView"
import CurrentTrackMetaDataView from "./components/currentTrackMetaDataView";
import PlaybackControl from "./components/playbackControl"
import RoomControl from "./components/roomControl"


const minSize = { width: 400, height: 700 };
const maxSize = { width: 400, height: 1080 };
const winIcon = new QIcon(nodeguiIcon);

interface MySonosDevice {
  name: string;
  uuid: string;
  volume?: number;
  groupName?: string;
  isPlaying: boolean;
  isPaused?: boolean;
  isTV?: boolean;
  CurrentTrackMetaData?: MyCurrentTrackMetaData;
}

interface MyCurrentTrackMetaData {
  Album?: string;
  Artist?: string;
  AlbumArtUri?: string;
  Title?: string;
  Duration?: string;
}

interface MySonosDevices {
  [key: string]: MySonosDevice;
}
interface MyOrderedSonosDevices {
  [key: number]: MySonosDevice;
}

let manager: SonosManager = new SonosManager();

type MyState = {
  devices?: any,
  orderedDevices?: any,
  selectedDeviceUuid: string,
  isLoading?: boolean,
}

class App extends React.Component<{}, MyState> {
  state: MyState = {
    devices<MySonosDevices>: {},
    orderedDevices<MyOrderedSonosDevices>: [],
    selectedDeviceUuid: '',
    isLoading: true,
  };

  async componentDidMount() {
    await this.sonosDiscovery();
    this.getSonosState();
      

    setInterval(() => {
      this.sonosDiscovery();

      manager.Devices.forEach(async (d:any) => {
        const result = await d.RefreshEventSubscriptions();
      });
    }, 300 * 1000);
  }

  componentDidUpdate(prevProps: any, prevState: any): void {
    const { devices } = this.state;

    if (JSON.stringify(prevState.devices) !== JSON.stringify(devices)) {
      const orderedDevices = this.setOrder(devices);
      this.setState({orderedDevices});

      if (!this.state.selectedDeviceUuid) {
        this.setState({selectedDeviceUuid: orderedDevices[0].uuid});
      }
    }
  }

  componentWillUnmount() {
    this.sonosDiscovery();

    manager.Devices.forEach(d => {
      d.CancelEvents();
      d.AlarmClockService.Events.removeAllListeners(ServiceEvents.Data)
      d.AVTransportService.Events.removeAllListeners(ServiceEvents.Data)
      d.RenderingControlService.Events.removeAllListeners(ServiceEvents.Data)
      d.ZoneGroupTopologyService.Events.removeAllListeners(ServiceEvents.Data)
    });
    manager.CancelSubscription();
  }

  sonosDiscovery(): Promise<boolean> {
    return manager.InitializeWithDiscovery(10);
  }

  getSonosState():void {
    manager.Devices.forEach((d:any) => {
      let mySonosDevice:MySonosDevice = {
          uuid: d.uuid,
          name: d.Name,
          groupName: d.GroupName,
          isPlaying: false,
          isPaused: false,
          isTV: false,
      };

      this.setState(prevState => {
        let mySonosDevices = {...prevState.devices};
        mySonosDevices[d.uuid] = mySonosDevice;

        if (!prevState.selectedDeviceUuid) {
          return {...prevState, devices: mySonosDevices, isLoading: false, selectedDeviceUuid: d.uuid};  
        }

        return { ...prevState, devices: mySonosDevices, isLoading: false };
      });

      d.AVTransportService.GetPositionInfo().then((data: any) => {
        this.setState(prevState => {
          let mySonosDevices = {...prevState.devices};
          
          if (
            data.TrackMetaData 
          ) {
            mySonosDevices[d.uuid] = {
              ...mySonosDevices[d.uuid], 
              ...{
                CurrentTrackMetaData: {
                  Album: data.TrackMetaData.Album,
                  Artist: data.TrackMetaData.Artist,
                  Title: data.TrackMetaData.Title,
                  Duration: data.TrackMetaData.Duration,
                }
              }
            };
          }

          if (
            JSON.stringify(prevState?.devices[d.uuid]?.CurrentTrackMetaData?.AlbumArtUri) !== JSON.stringify(data?.CurrentTrackMetaData?.AlbumArtUri) || 
            !prevState?.devices[d.uuid]?.CurrentTrackMetaData?.AlbumArtUri
          ) {
            mySonosDevices[d.uuid] = {
              ...mySonosDevices[d.uuid],
              ...{
                CurrentTrackMetaData: {
                  AlbumArtUri: data.TrackMetaData.AlbumArtUri,
                }
              }
            };
          }

          
          mySonosDevices[d.uuid].isTV = (data.TrackURI && data.TrackURI.includes('spdif'));
          

          return {devices: mySonosDevices};
        });
      })
      .catch((error:any) => {
        console.log(error);
      });

      
      
      d.Events.on(SonosEvents.Volume, (volume:number):void => {
        let mySonosDevice:any = {
          volume: volume
        };

        this.setState(prevState => {
          let mySonosDevices = {...prevState.devices};
          mySonosDevices[d.uuid] = {
            ...mySonosDevices[d.uuid] || {},
            ...mySonosDevice
          };

          return {...prevState, devices: mySonosDevices};
        });
      });

      d.AVTransportService.Events.on('serviceEvent', (data:any) => {
        this.setState(prevState => {
            let mySonosDevices = {...prevState.devices};

            if (mySonosDevices[d.uuid] && mySonosDevices[d.uuid].name) {
              mySonosDevices[d.uuid] = {
                ...(
                  mySonosDevices[d.uuid] || {}
                ), 
                ...{
                  isPlaying: data.TransportState === 'PLAYING',
                  isPaused: data.TransportState === 'PAUSED_PLAYBACK',
                  isTV: data.CurrentTrackURI && data.CurrentTrackURI.includes('spdif'),
                }
              };

              if (
                data.CurrentTrackMetaData && 
                JSON.stringify(prevState.devices[d.uuid].CurrentTrackMetaData.Title) !== JSON.stringify(data.CurrentTrackMetaData.Title)
              ) {
                mySonosDevices[d.uuid] = {
                  ...mySonosDevices[d.uuid], 
                  ...{
                    CurrentTrackMetaData: {
                      Album: data.CurrentTrackMetaData.Album,
                      Artist: data.CurrentTrackMetaData.Artist,
                      AlbumArtUri: data.CurrentTrackMetaData.AlbumArtUri,
                      Title: data.CurrentTrackMetaData.Title,
                      Duration: data.CurrentTrackMetaData.Duration,
                    }
                  }
                };
              }

              return { ...prevState, devices: mySonosDevices};
            }

            return prevState;
          });
      });
    })
  }

  setOrder (devices:MySonosDevices): MyOrderedSonosDevices {
    // order by playing state and alphabet
    return Object.keys(devices).map(deviceUuid => ({...devices[deviceUuid], uuid: deviceUuid})).sort((a:MySonosDevice, b:MySonosDevice): number => (
      (a.isPlaying === b.isPlaying)? 0 : a.isPlaying? -1 : 1 || a.name.localeCompare(b.name)
    ));
  }

  async handlePlay (): Promise<any> {
    await this.sonosDiscovery();

    const { selectedDeviceUuid, devices } = this.state;
    manager.Devices.forEach((d:any) => {
      if (d.uuid === selectedDeviceUuid) {
        d.Play();
      }
    });
  }

  async handlePause (): Promise<any> {
    await this.sonosDiscovery();

    const { selectedDeviceUuid, devices } = this.state;
    manager.Devices.forEach((d:any) => {
      if (d.uuid === selectedDeviceUuid) {
        d.Pause();
      }
    });
  }

  async handleNext (): Promise<any> {
    await this.sonosDiscovery();

    const { selectedDeviceUuid, devices } = this.state;
    manager.Devices.forEach((d:any) => {
      if (d.uuid === selectedDeviceUuid) {
        d.Next();
      }
    });
  }


  async handlePrev (): Promise<any> {
    await this.sonosDiscovery();

    const { selectedDeviceUuid, devices } = this.state;
    manager.Devices.forEach((d:any) => {
      if (d.uuid === selectedDeviceUuid) {
        d.Prev();
      }
    });
  }

  async setVolume (volume: number):Promise<any> {
    await this.sonosDiscovery();

    const { selectedDeviceUuid } = this.state;

    manager.Devices.forEach((d:any) => {
      if (d.uuid === selectedDeviceUuid) {
        d.SetVolume(volume);
      }
    });
  }

  selectHandler (uuid: string):void {
    this.setState({selectedDeviceUuid: uuid});
  }

  render() {
    const { 
      devices,
      selectedDeviceUuid,
      orderedDevices,
      isLoading,
    } = this.state;

    return (
      <Window
        windowIcon={winIcon}
        windowTitle="Open Sonos Controller"
        minSize={minSize}
        maxSize={maxSize}
        styleSheet={styleSheet}
      >
        <ErrorBoundary>
          <View id="mainContainer">
            {
              isLoading ? (
                <Text id="isLoadingText">Loading...</Text>
              ) : 
              (
                <>
                  { 
                    !devices[selectedDeviceUuid].isTV ? (
                      <View id="mainPlaybackControl">
                        <AlbumArtView albumArtUri={devices[selectedDeviceUuid]?.CurrentTrackMetaData?.AlbumArtUri || undefined}/>
                        {
                          devices[selectedDeviceUuid]?.CurrentTrackMetaData && (
                            <CurrentTrackMetaDataView currentTrackMetaData={devices[selectedDeviceUuid].CurrentTrackMetaData} />
                          )
                        }
                        {
                          devices[selectedDeviceUuid] && (
                            <PlaybackControl
                              isPlaying={devices[selectedDeviceUuid].isPlaying}
                              play={this.handlePlay.bind(this)}
                              pause={this.handlePause.bind(this)}
                              next={this.handleNext.bind(this)}
                              prev={this.handlePrev.bind(this)}
                            />
                          )
                        }
                      </View>
                    ) : (
                      <View id="mainTvControl">
                        <TvArtView />
                        <CurrentTrackMetaDataView currentTrackMetaData={{Album: "", Artist: "", Title: "TV"}} />
                      </View>
                    )
                  }
                  <View id="mainVolumeControl">
                    <VolumeSlider volume={devices[selectedDeviceUuid].volume} setVolume={this.setVolume.bind(this)} />
                  </View>
                  <View id="spacer" />

                  <BoxView direction={Direction.TopToBottom} id="mainDeviceList" style={`height: ${orderedDevices.length * 50}px`}>
                    {
                      orderedDevices.map((device: MySonosDevice) => (
                          <RoomControl
                            key={device.uuid}
                            uuid={device.uuid}
                            select={this.selectHandler.bind(this)}
                            isPlaying={device.isPlaying}
                            deviceName={device.name}
                            selectedDeviceUuid={selectedDeviceUuid}
                          />
                      ))
                    }
                  </BoxView>
                </>
              )
            }
          </View>
        </ErrorBoundary>
      </Window>
    );
  }
}

const styleSheet = `
  #isLoadingText {
    color: white;
  }
  #mainContainer {
    flex: 1;
    justify-content: 'flex-start';
    align-items: 'flex-start';
    align-content: 'flex-start';
    min-height: '100%';
    height: '100%';
    width: '100%';
    min-width: '350px';
    padding: '20px';
    background-color: '#272727';
  }

  #mainPlaybackControl {
    flex: 0;
    width: '360px';
    padding: '0px';
    margin: '0px';
  }

  #mainVolumeControl {
    margin-top: '20px';
    margin-bottom: '20px';
    margin-left: '0px';
    margin-right: '0px';
    width: '360px';
  }
  #spacer {
    flex: 1 1 1px;
    height: 1px;
    border: 0px solid green;
  }

  #mainDeviceList {
    width: '360px';
    padding: '0px';
    margin: '0px';
    align-self: 'flex-end';
    border: 0px solid green;
  }
`;

export default hot(App);
