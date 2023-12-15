import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";

import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedReaction, runOnJS
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import { Button, Image } from "../../common/components/SimpleComponents";
import PlayImage from "../../assets/images/play-button.png";
import History from "../../assets/images/history.png";

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

  const handlePlay = () => {
    setIsPlaying(current => !current);
  };

  // useEffect(() => {
  //   if (isPlaying) {
  //     let i = 0;
  //     const interval = setInterval(() => {
  //       if (i < logs.length) {
  //         const log = logs[i];
  //         const updatedTrackedPointers = log.value;
  //         for (const key in updatedTrackedPointers) {
  //           trackedPointers[key].value = updatedTrackedPointers[key];
  //         }
  //         i++;
  //       } else {
  //         clearInterval(interval);
  //       }
  //     }, stepInterval * 1000);
  //   }
  // }, [isPlaying]);

  console.log("isPlaying");
  console.log(isPlaying);
  return (
    <Animated.View style={{ flex: 1, backgroundColor: "white" }}>
      {trackedPointers.map((pointer, index) => (
        <PointerElement pointer={pointer} active={active} key={index} />
      ))}
      <Button
        bg="white"
        position={"absolute"}
        bottom={"0"}
        right={"0"}
        borderRad={"50px"}
        // onPress={handle}
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
  );
}
