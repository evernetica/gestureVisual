import { GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";

import Animated from "react-native-reanimated";
import { Block, Button, Image, Text } from "../../common/components/SimpleComponents";
import History from "../../assets/images/history.png";
import { useNavigation } from "@react-navigation/native";
import PointerElement from "../../common/components/AnimatedPointer.tsx";
import useGestureHook from "./useGestureHook.tsx";

export default function Example() {
  const { navigate } = useNavigation();

  const handlePlay = () => {
    navigate("History");
  };

  const {
    composedGesture,
    trackedPointers,
    gestureText,
    active
  } = useGestureHook();

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
