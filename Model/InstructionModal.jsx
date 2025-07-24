import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function InstructionModal({
  show,
  steps = [],
  storageKey = "hasUsedApp",
  onClose,
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!show) {
      setStep(0); // reset when modal closes
    }
  }, [show]);

  const handleFinish = async () => {
    await AsyncStorage.setItem(storageKey, "true");
    onClose?.(); // call parent close handler
  };

  const handleNext = () => {
    if (step === steps.length - 1) {
      handleFinish();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <Modal visible={show} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalBox}>
          <Text style={styles.stepText}>{steps[step]}</Text>

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {step === steps.length - 1 ? "Finish" : "Next"}
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
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
