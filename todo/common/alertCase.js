import { Alert, BackHandler } from "react-native";

export const BACK_ACTION = () => {
  Alert.alert("Hold on!", "앱을 종료하시겠습니까?", [
    {
      text: "취소",
      onPress: () => null,
    },
    { text: "확인", onPress: () => BackHandler.exitApp() }
  ]);
  return true;
};

