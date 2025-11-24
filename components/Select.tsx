import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { colors, radius } from "./theme";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

const Select: React.FC<SelectProps> = ({ label, value, onChange, options }) => {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || value;

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <View style={{ marginBottom: 12 }}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}

      <View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setOpen((prev) => !prev)}
          style={[
            styles.selectBox,
            open && { borderColor: "#B8B8C5" },
          ]}
        >
          <Text style={styles.selectText}>{selectedLabel}</Text>
          <Text style={{ color: "#A5A5AF" }}>{open ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        {open && (
          <View style={styles.dropdown}>
            <ScrollView
              style={{ maxHeight: 160 }}
              nestedScrollEnabled
            >
              {options.map((opt) => {
                const isActive = opt.value === value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => handleSelect(opt.value)}
                    style={[
                      styles.option,
                      isActive && styles.optionActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isActive && styles.optionTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: colors.textPrimary,
    marginBottom: 4,
    fontWeight: "500",
  },
  selectBox: {
    backgroundColor: colors.inputBackground,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    color: colors.textPrimary,
  },
  dropdown: {
    marginTop: 4,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionActive: {
    backgroundColor: "#F2F2F7",
  },
  optionText: {
    color: colors.textPrimary,
  },
  optionTextActive: {
    fontWeight: "600",
  },
});

export default Select;
