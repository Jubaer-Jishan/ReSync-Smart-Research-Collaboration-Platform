"use client";

import {
  useState,
  useRef,
  useEffect,
} from "react";

import { motion } from "framer-motion";

import { isValidPhoneNumber } from "libphonenumber-js";

import { PhoneInput } from "react-international-phone";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaUniversity,
} from "react-icons/fa";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({
  onSuccess,
}: RegisterFormProps) {

  const usernameRef =
    useRef<HTMLInputElement>(null);

  const emailRef =
    useRef<HTMLInputElement>(null);

  const institutionRef =
    useRef<HTMLInputElement>(null);

  const phoneRef =
    useRef<HTMLInputElement>(null);

  const departmentRef =
    useRef<HTMLSelectElement>(null);

  const roleRef =
    useRef<HTMLSelectElement>(null);

  const passwordRef =
    useRef<HTMLInputElement>(null);

  const confirmPasswordRef =
    useRef<HTMLInputElement>(null);

  const [mounted, setMounted] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [phone, setPhone] =
    useState("");

  const isPhoneValid =
    phone
      ? isValidPhoneNumber(phone)
      : false;

  const [formData, setFormData] =
    useState({
      name: "",
      username: "",
      email: "",
      institution: "",
      department: "",
      role: "",
      password: "",
      confirmPassword: "",
    });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // Email Validation
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isValidEmail =
    emailRegex.test(
      formData.email
    );

  // Password Validation
  const passwordRegex =
    /^(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;

  const isValidPassword =
    passwordRegex.test(
      formData.password
    );

  const passwordsMatch =
    formData.password ===
    formData.confirmPassword;
const generateStrongPassword =
  () => {

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%!&";

    let generatedPassword =
      "";

    for (
      let i = 0;
      i < 12;
      i++
    ) {

      generatedPassword +=
        chars.charAt(
          Math.floor(
            Math.random() *
              chars.length
          )
        );
    }

    setFormData({
      ...formData,
      password:
        generatedPassword,
      confirmPassword: "",
    });
  };

  if (!mounted)
    return null;

  return (

    <div className="w-full rounded-[32px] bg-white p-8">

      {/* Title */}
      <h1 className="mb-8 text-center text-4xl font-black text-slate-800">
        Register
      </h1>

      {/* Form */}
      <form
        onSubmit={(e) => {

          e.preventDefault();

          alert(
            "Account created successfully 😄🔥"
          );

          if (onSuccess) {
            onSuccess();
          }

        }}
      >
        {/* Full Name */}
        <div>

          <label className="mb-2 block text-sm font-bold tracking-wide text-slate-700">
            Full Name
          </label>

          <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-sm transition-all duration-300 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100">

            <FaUser className="text-slate-600" />

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              onKeyDown={(e) => {

  if (
    e.key === "Enter"
  ) {

    e.preventDefault();

    usernameRef.current?.focus();
  }
}}
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent px-3 py-4 text-slate-900 outline-none"
            />

          </div>

        </div>

        {/* Username */}
        <div>

          <label className="mb-2 block text-sm font-bold tracking-wide text-slate-700">
            Username
          </label>

          <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-sm transition-all duration-300 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100">

            <FaUser className="text-slate-600" />

            <input
              type="text"
              name="username"
              placeholder="Choose username"
              ref={usernameRef}

onKeyDown={(e) => {

  if (
    e.key === "Enter"
  ) {

    e.preventDefault();

    emailRef.current?.focus();
  }
}}
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-transparent px-3 py-4 text-slate-900 outline-none"
            />

          </div>

        </div>

        {/* Email */}
        <div>

          <label className="mb-2 block text-sm font-bold tracking-wide text-slate-700">
            Email
          </label>

          <div
            className={`flex items-center rounded-2xl bg-white px-4 shadow-sm transition-all duration-300 ${
              formData.email === ""
                ? "border border-slate-200"
                : isValidEmail
                ? "border border-green-500"
                : "border border-red-500"
            }`}
          >

            <FaEnvelope className="text-slate-600" />

            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              ref={emailRef}

onKeyDown={(e) => {

  if (
    e.key === "Enter"
  ) {

    e.preventDefault();

    institutionRef.current?.focus();
  }
}}
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent px-3 py-4 text-slate-900 outline-none"
            />

          </div>

        </div>

        {/* Institution */}
        <div>

          <label className="mb-2 block text-sm font-bold tracking-wide text-slate-700">
            Institution
          </label>

          <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-sm transition-all duration-300 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100">

            <FaUniversity className="text-slate-600" />

            <input
              type="text"
              name="institution"
              placeholder="Institution name"
              ref={institutionRef}

onKeyDown={(e) => {

  if (
    e.key === "Enter"
  ) {

    e.preventDefault();

    phoneRef.current?.focus();
  }
}}
              value={formData.institution}
              onChange={handleChange}
              className="w-full bg-transparent px-3 py-4 text-slate-900 outline-none"
            />

          </div>

        </div>

        {/* Phone */}
        <div>

          <label className="mb-2 block text-sm font-bold tracking-wide text-slate-700">
            Phone Number
          </label>

          <div
            className={`rounded-2xl bg-white p-3 shadow-sm transition-all duration-300 ${
              phone === ""
                ? "border border-slate-200"
                : isPhoneValid
                ? "border border-green-500"
                : "border border-red-500"
            }`}
          >

           <PhoneInput
  inputProps={{
    onKeyDown: (e: any) => {

      if (
        e.key === "Enter"
      ) {

        e.preventDefault();

        departmentRef.current?.focus();
      }
    },
  }}
  defaultCountry="bd"
  value={phone}
  onChange={(phone) =>
    setPhone(phone || "")
  }
/>


</div>

</div>
{/* Department */}
<div>

  <label className="mb-2 block text-sm font-bold tracking-wide text-slate-700">
    Department
  </label>

  <select
  ref={departmentRef}
  onKeyDown={(e) => {

    if (
      e.key === "Enter"
    ) {

      e.preventDefault();

      roleRef.current?.focus();
    }
  }}
  name="department"
    value={formData.department}
    onChange={handleChange}
    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
  >

    <option value="">
      Select department
    </option>

    <option value="CSE">
      CSE — Computer Science and Engineering
    </option>

    <option value="EEE">
      EEE — Electrical and Electronic Engineering
    </option>

    <option value="BBA">
      BBA — Business Administration
    </option>

    <option value="English">
      English — Department of English
    </option>

    <option value="LAW">
      LAW — Department of Law
    </option>

    <option value="Pharmacy">
      Pharmacy — Department of Pharmacy
    </option>

    <option value="Architecture">
      Architecture — Department of Architecture
    </option>

  </select>

</div>
        {/* Role */}
        <div>

          <label className="mb-2 block text-sm font-bold tracking-wide text-slate-700">
            Role
          </label>

          <select
  ref={roleRef}
  onKeyDown={(e) => {

    if (
      e.key === "Enter"
    ) {

      e.preventDefault();

      passwordRef.current?.focus();
    }
  }}
  name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          >

            <option value="">
              Select role
            </option>

            <option value="student">
              Student
            </option>

            <option value="researcher">
              Researcher
            </option>

            <option value="supervisor">
              Supervisor
            </option>

          </select>

        </div>

        {/* Password */}
<div>

  {/* Password Validation */}
  {formData.password !== "" && (

    <motion.div
      initial={{
        opacity: 0,
        y: -5,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className={`mt-3 rounded-xl px-4 py-3 text-sm font-bold shadow-sm ${
        isValidPassword
          ? "border border-green-500 bg-green-100 text-green-700"
          : "border border-red-500 bg-red-100 text-red-700"
      }`}
    >

      {isValidPassword ? (
        "Strong password"
      ) : (
        <>
          Password must contain:
          <br />
          • Minimum 8 characters
          <br />
          • At least 1 special character
          <br />
          (@ # $ % ! &)
        </>
      )}

    </motion.div>

  )}

  <label className="mb-2 block text-sm font-bold tracking-wide text-slate-700">
    Password
  </label>

  <button
    type="button"
    onClick={
      generateStrongPassword
    }
    className="mb-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-bold text-white shadow-md transition-all duration-300 hover:scale-105"
  >
    Generate Strong Password
  </button>

  <div
    className={`flex items-center rounded-2xl bg-white px-4 shadow-sm transition-all duration-300 ${
      formData.password === ""
        ? "border border-slate-200"
        : isValidPassword
        ? "border border-green-500"
        : "border border-red-500"
    }`}
  >

    <FaLock className="text-slate-600" />

    <input
      type={
        showPassword
          ? "text"
          : "password"
      }
      name="password"
      ref={passwordRef}
      onKeyDown={(e) => {

        if (
          e.key === "Enter"
        ) {

          e.preventDefault();

          confirmPasswordRef.current?.focus();
        }
      }}
      placeholder="Create password"
      value={formData.password}
      onChange={handleChange}
      className="w-full bg-transparent px-3 py-4 text-slate-900 outline-none"
    />

    <button
      type="button"
      onClick={() =>
        setShowPassword(
          !showPassword
        )
      }
      className="text-slate-600"
    >
      {showPassword ? (
        <FaEyeSlash />
      ) : (
        <FaEye />
      )}
    </button>

  </div>

</div>

{/* Confirm Password */}
<div>

  <label className="mb-2 block text-sm font-bold tracking-wide text-slate-700">
    Confirm Password
  </label>

  <div
    className={`flex items-center rounded-2xl bg-white px-4 shadow-sm transition-all duration-300 ${
      formData.confirmPassword === ""
        ? "border border-slate-200"
        : passwordsMatch
        ? "border border-green-500"
        : "border border-red-500"
    }`}
  >

    <FaLock className="text-slate-600" />

    <input
      type={
        showConfirmPassword
          ? "text"
          : "password"
      }
      name="confirmPassword"
      ref={confirmPasswordRef}
      onKeyDown={(e) => {

        if (
          e.key === "Enter"
        ) {

          e.preventDefault();

          alert(
            "Account created successfully 😄🔥"
          );
        }
      }}
      placeholder="Confirm password"
      value={
        formData.confirmPassword
      }
      onChange={handleChange}
      disabled={!isValidPassword}
      className="w-full bg-transparent px-3 py-4 text-slate-900 outline-none disabled:cursor-not-allowed disabled:opacity-50"
    />

    <button
      type="button"
      onClick={() =>
        setShowConfirmPassword(
          !showConfirmPassword
        )
      }
      className="text-slate-600"
    >
      {showConfirmPassword ? (
        <FaEyeSlash />
      ) : (
        <FaEye />
      )}
    </button>

  </div>

  {/* Match Message */}
  {formData.confirmPassword !== "" && (

    <motion.div
      initial={{
        opacity: 0,
        y: -5,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className={`mt-3 rounded-xl px-4 py-3 text-sm font-bold shadow-sm ${
        passwordsMatch
          ? "border border-green-500 bg-green-100 text-green-700"
          : "border border-red-500 bg-red-100 text-red-700"
      }`}
    >

      {passwordsMatch
        ? "Passwords match"
        : "Passwords do not match"}

    </motion.div>

  )}

</div>

        {/* Submit */}
        <div className="md:col-span-2">

          <button
  type="submit"
  className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-lg font-bold text-white shadow-[0_10px_40px_rgba(14,165,233,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(14,165,233,0.45)]"
>
  Create Account
</button>

        </div>

      </form>

    </div>
  );
}