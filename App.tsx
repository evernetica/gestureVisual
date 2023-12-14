import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";

import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedReaction, runOnJS
} from "react-native-reanimated";
import { useEffect, useState } from "react";

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

export default function Example() {
  const trackedPointers: Animated.SharedValue<Pointer>[] = [];
  const active = useSharedValue(false);
  const [logs, setLogs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);


  // useAnimatedReaction(() => {
  //     console.log("trackedPointers");
  //     console.log(trackedPointers);
  //     // setLogs(currentLogs =>([...currentLogs, JSON.parse(JSON.stringify(trackedPointers))]))
  //   }, (result) => {
  //     console.log("result");
  //     console.log(result);
  //     // setLogs(currentLogs =>([...currentLogs, JSON.parse(JSON.stringify(trackedPointers))]))
  //
  //   }
  // );

  const visualEffects = null;

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
  console.log("logs");
  console.log(logs);
  const gesture = Gesture.Manual()
    .onTouchesDown((e, manager) => {
      console.log("e");
      console.log(e);
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
  // .onStart(() => {
  //   active.value = true;
  // })
  // .onEnd(() => {
  //   active.value = false;
  // });
  // console.log("trackedPointers");
  // console.log(trackedPointers);
  const handlePlay = () => {
    setIsPlaying(current => !current);
  };

  useEffect(() => {
    if (isPlaying) {
      let i = 0;
      const interval = setInterval(() => {
        if (i < logs.length) {
          const log = logs[i];
          console.log("log");
          console.log(log);
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
  } , [isPlaying]);

  console.log("isPlaying");
  console.log(isPlaying);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={{ flex: 1 }}>
          {trackedPointers.map((pointer, index) => (
            <PointerElement pointer={pointer} active={active} key={index} />
          ))}
          <TouchableOpacity
            style={{ backgroundColor: "white", width: 100, height: 100, position: "absolute", bottom: 0, right: 0 }}
            onPress={handlePlay}
          ><Text>Play</Text></TouchableOpacity>
        </Animated.View>

      </GestureDetector>
    </GestureHandlerRootView>
  );
}
