import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";

import Animated, { useSharedValue, runOnJS } from "react-native-reanimated";
import { useCallback, useEffect, useState } from "react";
import { Block, Button, Image, Text } from "../../common/components/SimpleComponents";
import History from "../../assets/images/history.png";
import { useNavigation } from "@react-navigation/native";
import { Directions } from "react-native-gesture-handler";
import { useHistoryContext } from "../../common/HistoryContext.ts";
import PointerElement from "../../common/components/AnimatedPointer.tsx";

let stepInterval = 0.01;

let timeout;
export default function Example() {
  const trackedPointers: Animated.SharedValue<Pointer>[] = [];
  const active = useSharedValue(false);
  const [logs, setLogs] = useState([]);
  const [gestureText, setText] = useState("");
  const { navigate } = useNavigation();
  const { setHistory } = useHistoryContext();

  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      //set logs to global
    });
  }, [logs]);

  const setGestureText = useCallback((text) => {
    setText(text);
  }, [logs]);

  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
    if (gestureText && logs.length > 0) {
      timeout = setTimeout(() => {
        setHistory(current => {
          return [...current, { actions: logs, title: gestureText }];
        });
        setLogs([]);
        setText("");
      }, 800);
    }

  }, [logs, gestureText]);

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

  const longPress = Gesture.LongPress()
    .onStart(() => {
      runOnJS(setGestureText)(`Long press`);
    });

  const pinch = Gesture.Pinch()
    .simultaneousWithExternalGesture(gestureManual)
    .onUpdate((callback) => {
      if (callback.numberOfPointers === 2) {
        runOnJS(setGestureText)(`Pinch zoom`);
      }
    })
    .onEnd((e) => {
      runOnJS(setGestureText)(`Pinch zoom ${Number(e.scale).toFixed(2)}`);
    });

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .simultaneousWithExternalGesture(gestureManual)
    .onEnd(() => {
      runOnJS(setGestureText)(`Swipe right`);
    });
  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .simultaneousWithExternalGesture(gestureManual)
    .onEnd(() => {
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
    .onEnd(() => {
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
              fontSize={"22px"}
            >
              {gestureText}
            </Text>
          </Block>
          <Button
            bg="white"
            position={"absolute"}
            bottom={"0"}
            right={"0"}
            borderRad={"50px"}
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
