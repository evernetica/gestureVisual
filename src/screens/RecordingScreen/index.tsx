import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";

import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS
} from "react-native-reanimated";
import { useCallback, useEffect, useState } from "react";
import { Block, Button, Image, Text } from "../../common/components/SimpleComponents";
import History from "../../assets/images/history.png";
import { useNavigation } from "@react-navigation/native";
import { Directions } from "react-native-gesture-handler";
import { useHistoryContext } from "../../common/HistoryContext.ts";
import debounce from "lodash/debounce.js";

let stepInterval = 0.01;

function PointerElement(props: {
  pointer: Animated.SharedValue<Pointer>,
  active: Animated.SharedValue<boolean>,
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: props.pointer.value.x },
      { translateY: props.pointer.value.y },
      {
        scale:
          (props.pointer.value.visible ? 1 : 0) *
          (props.active.value ? 1.3 : 1)
      }
    ],
    backgroundColor: "blue"
  }));

  return <Animated.View style={[styles.pointer, animatedStyle]} />;
}

const styles = StyleSheet.create({
  pointer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "red",
    position: "absolute",
    marginStart: -30,
    marginTop: -30
  }
});
let timeout;
export default function Example() {
  const trackedPointers: Animated.SharedValue<Pointer>[] = [];
  const active = useSharedValue(false);
  const [logs, setLogs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gestureText, setGestureText] = useState("");
  const { navigate } = useNavigation();
  const { history, setHistory } = useHistoryContext();

  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      //set logs to global
    });
  }, [logs]);


  useEffect(() => {
    if (gestureText && logs.length > 0) {
      setHistory(current => {
        return [...current, { actions: logs, title: gestureText }];
      });
      setLogs([])
    }
  }, [gestureText, logs]);


  useEffect(() => {
    if (gestureText) {
      setTimeout(() => {
        setGestureText("");
      }, 1000);
    }
  }, [gestureText]);


  for (let i = 0; i < 12; i++) {
    trackedPointers[i] = useSharedValue(
      {
        visible: false,
        x: 0,
        y: 0
      });
  }

  let timestamp = null;

  const updateLogs = (updatedTrackedPointers) => {
    setLogs(currentLogs => {
      const lastPointer = currentLogs[currentLogs.length - 1] && JSON.parse(JSON.stringify(currentLogs[currentLogs.length - 1]))?.value;
      if (lastPointer) {
        const updatedTrackedPointersKeys = Object.keys(updatedTrackedPointers);
        updatedTrackedPointersKeys.forEach(key => {
          lastPointer[key] = updatedTrackedPointers[key];
        });
      }
      return [...currentLogs, { timestamp: new Date().getTime() - timestamp, value: updatedTrackedPointers }];
    });
  };
  const gestureManual = Gesture.Manual()
    .onTouchesDown((e, manager) => {
      if (!timestamp) {
        timestamp = new Date().getTime();
      }
      const updatedTrackedPointers = {};
      for (const touch of e.changedTouches) {
        trackedPointers[touch.id].value = {
          visible: true,
          x: touch.x,
          y: touch.y
        };
        updatedTrackedPointers[touch.id] = {
          visible: true,
          x: touch.x,
          y: touch.y
        };
      }
      runOnJS(updateLogs)(updatedTrackedPointers);


      if (e.numberOfTouches >= 2) {
        manager.activate();
      }
    })
    .onTouchesMove((e, _manager) => {
      const updatedTrackedPointers = {};

      for (const touch of e.changedTouches) {
        trackedPointers[touch.id].value = {
          visible: true,
          x: touch.x,
          y: touch.y
        };
        updatedTrackedPointers[touch.id] = {
          visible: true,
          x: touch.x,
          y: touch.y
        };
      }
      runOnJS(updateLogs)(updatedTrackedPointers);

    })
    .onTouchesUp((e, manager) => {
      const updatedTrackedPointers = {};

      for (const touch of e.changedTouches) {
        trackedPointers[touch.id].value = {
          timestamp: new Date().getTime() - timestamp,
          visible: false,
          x: touch.x,
          y: touch.y
        };
        updatedTrackedPointers[touch.id] = {
          visible: true,
          x: touch.x,
          y: touch.y
        };
      }
      runOnJS(updateLogs)(updatedTrackedPointers);

      if (e.numberOfTouches === 0) {
        manager.end();
      }
    });
  const handlePlay = () => {
    navigate("History");
  };

  useEffect(() => {
    if (isPlaying) {
      let i = 0;
      const interval = setInterval(() => {
        if (i < logs.length) {
          const log = logs[i];
          const updatedTrackedPointers = log.value;
          for (const key in updatedTrackedPointers) {
            trackedPointers[key].value = updatedTrackedPointers[key];
          }
          i++;
        } else {
          clearInterval(interval);
        }
      }, stepInterval * 1000);
    }
  }, [isPlaying]);

  const longPress = Gesture.LongPress()
    .onStart(() => {
      console.log("start");
      runOnJS(setGestureText)(`Long press`);
    });

  const debounseZoomThrottlingFunc = debounce((text) => {
    setGestureText(text);
  }, 1000);

  const saveDrawingLogs = debounce((logs) => {
    setHistory(current => {
      return [...current, { actions: logs, title: "Drawing" }];
    });
  }, 5000);

  const handleThrotle = (text) => {
    debounseZoomThrottlingFunc(text);
  };

  const pinch = Gesture.Pinch()
    .simultaneousWithExternalGesture(gestureManual)
    .onUpdate((callback) => {
      if (callback.numberOfPointers === 2) {
        runOnJS(handleThrotle)(`Pinch zoom ${Number(callback.scale).toFixed(2)}`);

      }
    })
    .onEnd((e, success) => {
    });

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .simultaneousWithExternalGesture(gestureManual)
    .onEnd((callback) => {
      runOnJS(setGestureText)(`Swipe right`);
    });
  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .simultaneousWithExternalGesture(gestureManual)
    .onEnd((callback) => {
      runOnJS(setGestureText)(`Swipe left`);
    });
  const flingTop = Gesture.Fling()
    .direction(Directions.UP)
    .simultaneousWithExternalGesture(gestureManual)
    .onEnd((callback) => {
      runOnJS(setGestureText)(`Swipe up`);

      console.log(callback);
    });
  const flingDown = Gesture.Fling()
    .direction(Directions.DOWN)
    .simultaneousWithExternalGesture(gestureManual)
    .onEnd((callback) => {
      runOnJS(setGestureText)(`Swipe down`);
    });

  const composedGesture = Gesture.Race(
    gestureManual,
    longPress,
    pinch,
    flingRight,
    flingLeft,
    flingTop,
    flingDown
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={{ flex: 1, backgroundColor: "black" }}>
          {trackedPointers.map((pointer, index) => (
            <PointerElement pointer={pointer} active={active} key={index} />
          ))}
          <Block
            position={"absolute"}
            top={"40%"}
            left={"0"}
            width={"100%"}
            flexDirection={"row"}
            justifyContent={"center"}
          >
            <Text
              color={"white"}
              fontSize={"20px"}
            >{gestureText}</Text>
          </Block>
          <Button
            bg="white"
            position={"absolute"}
            bottom={"0"}
            right={"0"}
            borderRad={"50px"}
            // style={{ backgroundColor: "white", width: 100, height: 100, position: "absolute", bottom: 0, right: 0 }}
            onPress={handlePlay}
            width={"70px"}
            height={"70px"}
            alignItems={"center"}
            justifyContent={"center"}
          >

            <Image
              source={History}
              imageWidth={"50px"}
              imageHeight={"50px"}
            />
          </Button>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
