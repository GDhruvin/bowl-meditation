// components/InstructionModal.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function InstructionModal({
  showInstructions,
  setShowInstructions,
}) {
  const [instructionStep, setInstructionStep] = useState(0);

  const instructionSteps = [
    "👆 Step 1: Tap the bowl once to play a calming sound.",
    "🌀 Step 2: Use two fingers to rotate the bowl and begin meditation sound.",
    "✋ Step 3: Long press to stop all sounds anytime.",
  ];

  const handleFinishInstructions = async () => {
    setShowInstructions(false);
    await AsyncStorage.setItem("hasUsedApp", "true");
  };

  return (
    <Modal visible={showInstructions} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalBox}>
          <Text style={styles.stepText}>
            {instructionSteps[instructionStep]}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (instructionStep === instructionSteps.length - 1) {
                handleFinishInstructions();
              } else {
                setInstructionStep((prev) => prev + 1);
              }
            }}
          >
            <Text style={styles.buttonText}>
              {instructionStep === instructionSteps.length - 1
                ? "Finish"
                : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
  },
  stepText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1C6758",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  resetBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 150,
    backgroundColor: "#A91D3A",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
