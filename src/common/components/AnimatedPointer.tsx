import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { StyleSheet } from "react-native";



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

export default PointerElement;

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
