import React, { useRef, useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { getFeedbacks } from "../../../lib/interviewAI";
import Loading from "../../../components/Loading";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { loadInterviewResult } from "../../../lib/AstraDBConfig";

const MockFeedback = () => {
  const bottomSheetRef = useRef(null);
  const { user } = useGlobalContext();
  const result = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const fetchInterviewResult = async (result) => {
    setIsLoading(true);
    try {
      console.log(result.isNew);
      if (result.isNew === "new") {
        setResults(
          await getFeedbacks(
            result.questions.split("#$%,"),
            result.answers.split("#$%,"),
            user.$id,
            result.interviewResult
          )
        );
      } else {
        setResults(await loadInterviewResult(result.session));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviewResult(result);
  }, []);

  // Define snap points as memoized value to prevent re-renders
  const snapPoints = useMemo(() => ["35%", "90%"], []);

  const renderContent = () => (
    <BottomSheetScrollView>
      <View className="bg-[#131417] w-full h-auto p-5">
        <View className="flex-row justify-between">
          <Text className="text-white font-geistSemiBold">Details</Text>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {results?.[0]?.feedbacks.map(
            ({ question, answer, feedback }, index) => (
              <View key={index}>
                {/* Question */}
                <View className="mt-10 w-auto bg-[#242627] p-3 rounded-t-2xl rounded-br-2xl flex flex-col justify-between">
                  <Text className="text-white font-geistRegular text-xs">
                    {question}
                  </Text>
                  <View className="mt-4 border-t rounded-full w-full border-gray-500"></View>
                  <Text className="text-gray-400 font-geistMedium text-[10px] mt-2 text-right">
                    {index + 1} of {results?.[0]?.feedbacks.length}
                  </Text>
                </View>
                {/* Answer */}
                <View className="mt-5 w-auto bg-[#3F454D] p-3 rounded-t-2xl rounded-bl-2xl flex flex-col justify-between">
                  <Text className="text-white font-geistRegular text-xs">
                    {answer}
                  </Text>
                </View>
                {/* Feedback */}
                <View className="bg-[#242627] mt-5 p-3 rounded-2xl">
                  <Text className="text-white font-geistRegular text-xs text-center">
                    Feedback
                  </Text>
                  <View className="my-2 border-t rounded-full border-gray-500"></View>
                  <Text className="text-white font-geistRegular text-xs text-center">
                    {feedback}
                  </Text>
                </View>
              </View>
            )
          )}
        </ScrollView>
      </View>
    </BottomSheetScrollView>
  );

  return (
    <View className="bg-[#111315] min-h-full w-full flex items-center pt-14">
      {isLoading && (
        <Loading additionStyle="bottom-0 h-full w-full z-[1000] bg-black" />
      )}
      <GestureHandlerRootView className="flex-1 w-full">
        <View className="flex-1 w-full justify-center items-center">
          <Text className="text-white text-center text-xl font-geistBold mb-10">
            Job Interview
          </Text>
          <Text className="text-white text-center font-geistSemiBold text-base mt-3">
            {result.interviewResult} Job Interview
          </Text>
          <Image
            source={{ uri: "background-image-url" }}
            style={{
              position: "absolute",
              width: "100%",
              height: "50%",
              top: 0,
              resizeMode: "cover",
            }}
          />
          {/* Check Circle */}
          <View className="flex-1 items-center w-full pt-24 gap-7">
            <View className="rounded-full w-48 h-48 border border-[#9CA3AF] bg-[#6B7280]/30 items-center justify-center">
              <Ionicons
                name={results?.[0]?.icons?.name}
                size={96}
                color={results?.[0]?.icons?.color}
              />
              <Text className="text-white font-geistSemiBold text-base mt-2">
                {results?.[0]?.grade}
              </Text>
            </View>
          </View>
          <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            backgroundStyle={{ backgroundColor: "#131417" }}
            handleIndicatorStyle={{ backgroundColor: "#e0e0e0" }}
            enableHandlePanningGesture={true}
            style={{
              borderWidth: 1.5,
              borderColor: "#5a5c5d",
              borderTopStartRadius: 10,
              borderTopEndRadius: 10,
            }}
          >
            {renderContent()}
            <View className=" justify-end items-center pb-5 mx-5">
              {result.isNew === "new" ? (
                <TouchableOpacity
                  onPress={() => router.push("aiFeature")}
                  className="bg-blue-500 py-3 px-6 rounded-md mb-4 w-full"
                >
                  <Text className="text-white text-center font-geistSemiBold">
                    Done
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => router.push("history/interviewhistory")}
                  className="bg-blue-500 py-3 px-6 rounded-md mb-4 w-full"
                >
                  <Text className="text-white text-center font-geistSemiBold">
                    Back
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </BottomSheet>
        </View>
      </GestureHandlerRootView>
    </View>
  );
};

export default MockFeedback;
