import Slider from "@react-native-community/slider";
import { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import {
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Rating,
  SegmentedControl,
  Stepper,
  TagsInput,
} from "@/components/inputs/choice-inputs";
import { ColorPicker } from "@/components/inputs/color-picker";
import { DateField } from "@/components/inputs/date-field";
import { FilePickerField, fileSummary, PickedFile } from "@/components/inputs/file-picker-field";
import { OtpInput } from "@/components/inputs/otp-input";
import { PasswordInput } from "@/components/inputs/password-input";
import { PhotoPickerField, photoSummary, PickedPhoto } from "@/components/inputs/photo-picker-field";
import { SelectField } from "@/components/inputs/select-field";
import { Field, Input, ui } from "@/components/ui";
import { toIsoDate } from "@/utils/date";

const POSITIONS = [
  "Mobile Developer",
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "QA Engineer",
];
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Internship"];
const WORK_MODES = ["On-site", "Remote", "Hybrid"];
const LANGUAGES = ["English", "French", "Kinyarwanda", "Swahili"];
const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SHIRT_COLORS = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#1A1A1A" },
  { name: "Navy", hex: "#1F2A44" },
  { name: "Grey", hex: "#8C8C8C" },
  { name: "Green", hex: "#0E7C66" },
];
const CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  photo: null as PickedPhoto | null,
  position: null as string | null,
  employmentType: "Full-time",
  workMode: null as string | null,
  startDate: null as Date | null,
  noticeWeeks: 4,
  willingToRelocate: false,
  expectedSalary: "",
  yearsOfExperience: 0,
  skills: [] as string[],
  languages: [] as string[],
  englishLevel: 0,
  portfolioUrl: "",
  cv: null as PickedFile | null,
  coverLetter: "",
  shirtSize: null as string | null,
  shirtColor: null as string | null,
  password: "",
  code: "",
  acceptTerms: false,
};

type Form = typeof initialForm;
type Errors = Partial<Record<keyof Form, string>>;

function validate(form: Form, sentCode: string | null) {
  const errors: Errors = {};
  if (!form.fullName.trim()) errors.fullName = "Required";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter a valid email";
  if (form.phone.replace(/\D/g, "").length < 9) errors.phone = "Enter a valid phone number";
  if (!form.photo) errors.photo = "Required";
  if (!form.position) errors.position = "Required";
  if (!form.workMode) errors.workMode = "Required";
  if (!form.startDate) errors.startDate = "Required";
  if (form.skills.length === 0) errors.skills = "Add at least one skill";
  if (form.languages.length === 0) errors.languages = "Select at least one";
  if (form.portfolioUrl && !/^https?:\/\/\S+\.\S+$/.test(form.portfolioUrl))
    errors.portfolioUrl = "Enter a full link (https://...)";
  if (!form.cv) errors.cv = "Required";
  if (form.password.length < 8) errors.password = "At least 8 characters";
  if (!sentCode || form.code !== sentCode) errors.code = "Verify your phone number";
  if (!form.acceptTerms) errors.acceptTerms = "Required";
  return errors;
}

export default function ApplicationForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSubmitted(false);
  };

  const sendCode = () => {
    if (form.phone.replace(/\D/g, "").length < 9) {
      setErrors({ ...errors, phone: "Enter a valid phone number" });
      return;
    }
    setSentCode(String(Math.floor(100000 + Math.random() * 900000)));
    set("code", "");
  };

  const submit = () => {
    const found = validate(form, sentCode);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const { password, code, ...data } = form;
    const application = {
      ...data,
      photo: form.photo && photoSummary(form.photo),
      startDate: form.startDate && toIsoDate(form.startDate),
      expectedSalary: form.expectedSalary ? Number(form.expectedSalary) : null,
      cv: form.cv && fileSummary(form.cv),
    };
    console.log(JSON.stringify(application, null, 2));

    setForm(initialForm);
    setSentCode(null);
    setSubmitted(true);
  };

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text>Personal details</Text>

        <Field label="Full name" error={errors.fullName}>
          <Input
            value={form.fullName}
            onChangeText={(v) => set("fullName", v)}
            autoCapitalize="words"
            autoComplete="name"
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <Input
            value={form.email}
            onChangeText={(v) => set("email", v)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <Input
            value={form.phone}
            onChangeText={(v) => set("phone", v)}
            placeholder="+250 7XX XXX XXX"
            keyboardType="phone-pad"
            autoComplete="tel"
          />
        </Field>
        <Field label="Photo" error={errors.photo}>
          <PhotoPickerField value={form.photo} onChange={(v) => set("photo", v)} />
        </Field>

        <Text>The role</Text>

        <Field label="Position" error={errors.position}>
          <SelectField
            value={form.position}
            options={POSITIONS}
            onChange={(v) => set("position", v)}
            placeholder="Select a position"
          />
        </Field>
        <Field label="Employment type">
          <SegmentedControl
            options={EMPLOYMENT_TYPES}
            value={form.employmentType}
            onChange={(v) => set("employmentType", v)}
          />
        </Field>
        <Field label="Work mode" error={errors.workMode}>
          <RadioGroup options={WORK_MODES} value={form.workMode} onChange={(v) => set("workMode", v)} />
        </Field>
        <Field label="Start date" error={errors.startDate}>
          <DateField
            value={form.startDate}
            onChange={(v) => set("startDate", v)}
            minimumDate={new Date()}
          />
        </Field>
        <Field label={`Notice period: ${form.noticeWeeks} weeks`}>
          <Slider
            minimumValue={0}
            maximumValue={12}
            step={1}
            value={form.noticeWeeks}
            onValueChange={(v) => set("noticeWeeks", v)}
          />
        </Field>
        <View style={[ui.row, styles.switchRow]}>
          <Text style={styles.flex}>Willing to relocate</Text>
          <Switch
            value={form.willingToRelocate}
            onValueChange={(v) => set("willingToRelocate", v)}
          />
        </View>
        <Field label="Expected salary (USD / month)">
          <Input
            value={form.expectedSalary}
            onChangeText={(v) => set("expectedSalary", v.replace(/[^0-9.]/g, ""))}
            keyboardType="decimal-pad"
          />
        </Field>

        <Text>Experience</Text>

        <Field label="Years of experience">
          <Stepper
            value={form.yearsOfExperience}
            onChange={(v) => set("yearsOfExperience", v)}
            max={40}
          />
        </Field>
        <Field label="Skills" error={errors.skills}>
          <TagsInput
            value={form.skills}
            onChange={(v) => set("skills", v)}
            placeholder="Type a skill and press Enter"
          />
        </Field>
        <Field label="Languages" error={errors.languages}>
          <CheckboxGroup
            options={LANGUAGES}
            value={form.languages}
            onChange={(v) => set("languages", v)}
          />
        </Field>
        <Field label="English level">
          <Rating value={form.englishLevel} onChange={(v) => set("englishLevel", v)} />
        </Field>
        <Field label="Portfolio / GitHub" error={errors.portfolioUrl}>
          <Input
            value={form.portfolioUrl}
            onChangeText={(v) => set("portfolioUrl", v)}
            placeholder="https://"
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Field>
        <Field label="CV (PDF or Word)" error={errors.cv}>
          <FilePickerField
            file={form.cv}
            onChange={(v) => set("cv", v)}
            type={CV_TYPES}
            label="Upload CV"
          />
        </Field>
        <Field label="Cover letter">
          <Input
            value={form.coverLetter}
            onChangeText={(v) => set("coverLetter", v)}
            multiline
            numberOfLines={5}
            maxLength={500}
            style={styles.textarea}
          />
        </Field>

        <Text>Welcome pack</Text>

        <Field label="T-shirt size">
          <SelectField
            value={form.shirtSize}
            options={SHIRT_SIZES}
            onChange={(v) => set("shirtSize", v)}
            placeholder="Select a size"
          />
        </Field>
        <Field label="T-shirt colour">
          <ColorPicker
            options={SHIRT_COLORS}
            value={form.shirtColor}
            onChange={(v) => set("shirtColor", v)}
          />
        </Field>

        <Text>Account</Text>

        <Field label="Password" error={errors.password}>
          <PasswordInput
            value={form.password}
            onChangeText={(v) => set("password", v)}
            autoComplete="new-password"
          />
        </Field>
        <Field label="Phone verification" error={errors.code}>
          {sentCode && (
            <>
              <Text>
                Code sent to {form.phone} (test code: {sentCode})
              </Text>
              <OtpInput value={form.code} onChange={(v) => set("code", v)} />
            </>
          )}
          <Button title={sentCode ? "Resend code" : "Send code"} onPress={sendCode} />
        </Field>
        <View style={ui.field}>
          <Checkbox
            label="I agree to the terms and privacy policy"
            checked={form.acceptTerms}
            onChange={(v) => set("acceptTerms", v)}
          />
          {errors.acceptTerms && <Text style={ui.error}>{errors.acceptTerms}</Text>}
        </View>

        {hasErrors && <Text style={[ui.error, styles.message]}>Please fix the errors above.</Text>}
        {submitted && <Text style={styles.message}>Application submitted.</Text>}

        <Button title="Submit" onPress={submit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  flex: {
    flex: 1,
  },
  switchRow: {
    marginBottom: 16,
  },
  textarea: {
    height: 110,
    textAlignVertical: "top",
  },
  message: {
    marginBottom: 12,
  },
});
