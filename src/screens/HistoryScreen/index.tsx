import Animated, { useSharedValue } from "react-native-reanimated";
import { useEffect, useState } from "react";
import { Block, Button, Image, StyledScrollView, Text } from "../../common/components/SimpleComponents";
import PlayImage from "../../assets/images/play-button.png";
import { useHistoryContext } from "../../common/HistoryContext.ts";
import { useNavigation } from "@react-navigation/native";
import PointerElement from "../../common/components/AnimatedPointer.tsx";
import RecordingIcon from "../../assets/images/button.png";

let stepInterval = 0.01;

export default function Example() {
  const trackedPointers: Animated.SharedValue<Pointer>[] = [];
  const active = useSharedValue(false);
  const [logs, setLogs] = useState([]);
  const { goBack } = useNavigation();
  const { history } = useHistoryContext();

  for (let i = 0; i < 12; i++) {
    trackedPointers[i] = useSharedValue(
      {
        visible: false,
        x: 0,
        y: 0
      });
  }

  useEffect(() => {
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
        trackedPointers.forEach(pointer => {
          pointer.value = {
            visible: false,
            x: 0,
            y: 0
          };
        });
      }
    }, stepInterval * 1000);
  }, [logs]);

  const handleLogsSelect = (item) => () => {
    setLogs(item.actions);
  };
  return (
    <Animated.View style={{ flex: 1, backgroundColor: "white" }}>
      {trackedPointers.map((pointer, index) => (
        <PointerElement pointer={pointer} active={active} key={index} />
      ))}
      <Block
        position={"absolute"}
        left={"16px"}
        pt={"40px"}
        height={"100%"}
      >
        <Text fontSize={"22px"}>Logs</Text>
        {
          history.length === 0 && <Text>Empty</Text>
        }
        <StyledScrollView>
          {
            history.map((item, index) => (
              <Button
                pt={"16px"}
                pb={"16px"}
                key={item.title + index}
                alignItems={"center"}
                onPress={handleLogsSelect(item)}
                flexDirection={"row"}
                justifyContent={"space-between"}
              >
                <Text mr={"16px"}>{item.title}</Text>
                <Image
                  source={PlayImage}
                  imageWidth={"16px"}
                  imageHeight={"16px"}
                />
              </Button>
            ))
          }
        </StyledScrollView>

      </Block>
      <Button
        position={"absolute"}
        bottom={"0"}
        right={"0"}
        borderRad={"50px"}
        onPress={goBack}
        width={"70px"}
        height={"70px"}
        alignItems={"center"}
        justifyContent={"center"}

      >
        <Image
          source={RecordingIcon}
          imageWidth={"50px"}
          imageHeight={"50px"}
        />
      </Button>
    </Animated.View>
  );
}
