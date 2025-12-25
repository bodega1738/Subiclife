"use client"

import type React from "react"
import { useState, Suspense, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { User, Mail, Phone, MapPin, Calendar, Heart, ArrowLeft, Camera, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUser } from "@/lib/user-context"

function RegisterForm() {
  const [firstName, setFirstName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [birthday, setBirthday] = useState("")
  const [address, setAddress] = useState("")
  const [nationality, setNationality] = useState("")
  const [gender, setGender] = useState("")
  const [civilStatus, setCivilStatus] = useState("")
  const [validIdType, setValidIdType] = useState("")
  const [validIdNumber, setValidIdNumber] = useState("")
  const [selfiePhoto, setSelfiePhoto] = useState<string | null>(null)
  const [idPhoto, setIdPhoto] = useState<string | null>(null)

  const selfieInputRef = useRef<HTMLInputElement>(null)
  const idInputRef = useRef<HTMLInputElement>(null)
  
  // Beneficiary State
  const [beneficiaryName, setBeneficiaryName] = useState("")
  const [beneficiaryRelation, setBeneficiaryRelation] = useState("")
  const [beneficiaryBirthday, setBeneficiaryBirthday] = useState("")
  
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()

  const isOver18 = (dateString: string) => {
    if (!dateString) return false
    const birthDate = new Date(dateString)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18
    }
    return age >= 18
  }

  const isFormValid =
    firstName && lastName && email && phone && birthday && isOver18(birthday) && address &&
    nationality && gender && civilStatus &&
    beneficiaryName && beneficiaryRelation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    const fullName = `${firstName} ${middleName ? middleName + " " : ""}${lastName}`
    login(
      fullName, 
      email, 
      `+63 ${phone}`, 
      birthday, 
      address, 
      {
        name: beneficiaryName,
        relationship: beneficiaryRelation,
        birthday: beneficiaryBirthday
      },
      nationality,
      gender,
      civilStatus,
      validIdType,
      validIdNumber,
      idPhoto || undefined,
      selfiePhoto || undefined
    )
    
    setIsLoading(false)
    router.push("/onboarding")
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative overflow-hidden">
      {/* Premium Northern Lights Gradient - Enhanced */}
      <div className="absolute inset-0 z-0 bg-white overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-teal-200/40 blur-[100px] rounded-full mix-blend-multiply animate-pulse"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-200/30 blur-[120px] rounded-full mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-100/50 blur-[100px] rounded-full mix-blend-multiply"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-teal-100/30 blur-[100px] rounded-full mix-blend-multiply"></div>
      </div>

      {/* Header */}
      <div className="pt-8 px-6 pb-4 text-center relative z-10">
        <button
          onClick={() => router.push("/")}
          className="absolute left-6 top-8 p-2 -ml-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>

        {/* Logo - Refined Header */}
        <div className="mb-2 flex justify-center">
          <img src="/images/subic-life-script-logo.png" alt="Subic Life Logo" className="h-16 object-contain brightness-0" />
        </div>
      </div>

      {/* Form Container - Glass Effect */}
      <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-t-[2.5rem] border-t border-white/60 px-8 pt-10 pb-8 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
          
          {/* First Name */}
          <div className="space-y-1.5">
            <label htmlFor="firstName" className="block text-base font-bold text-slate-900">
              First name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your given name"
                className="h-14 text-base pl-12 bg-gray-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-gray-400 font-medium"
                required
              />
            </div>
          </div>

          {/* Middle Name */}
          <div className="space-y-1.5">
            <label htmlFor="middleName" className="block text-base font-bold text-slate-900">
              Middle name
            </label>
            <Input
              id="middleName"
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="Optional"
              className="h-14 text-base px-5 bg-gray-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-gray-400 font-medium"
            />
            <p className="text-xs text-slate-400 px-1">Optional</p>
          </div>

          {/* Last Name */}
          <div className="space-y-1.5">
            <label htmlFor="lastName" className="block text-base font-bold text-slate-900">
              Last name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="h-14 text-base pl-12 bg-gray-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-gray-400 font-medium"
                required
              />
            </div>
          </div>

          {/* Birth Date */}
          <div className="space-y-1.5">
            <label htmlFor="birthday" className="block text-base font-bold text-slate-900">
              Birth date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="h-14 text-base pl-12 bg-gray-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all font-medium"
                required
              />
            </div>
            <p className="text-xs text-slate-400 px-1">Month, Day, Year</p>
          </div>

          {/* Email - Keeping essential fields */}
          <div className="space-y-1.5 pt-2">
            <label htmlFor="email" className="block text-base font-bold text-slate-900">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="h-14 text-base pl-12 bg-gray-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-gray-400 font-medium"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-base font-bold text-slate-900">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="917 123 4567"
                className="h-14 text-base pl-12 bg-gray-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-gray-400 font-medium"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label htmlFor="address" className="block text-base font-bold text-slate-900">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="City, Province"
                className="h-14 text-base pl-12 bg-gray-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-gray-400 font-medium"
                required
              />
            </div>
          </div>

          {/* Compliance Section */}
          <div className="space-y-5 pt-2">
            <div className="space-y-1.5">
              <label htmlFor="nationality" className="block text-base font-bold text-slate-900">
                Nationality
              </label>
              <Input
                id="nationality"
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="e.g. Filipino"
                className="h-14 text-base px-5 bg-gray-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-gray-400 font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-base font-bold text-slate-900">
                  Gender
                </label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="h-14 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 font-medium text-slate-900">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-base font-bold text-slate-900">
                  Civil Status
                </label>
                <Select value={civilStatus} onValueChange={setCivilStatus}>
                  <SelectTrigger className="h-14 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 font-medium text-slate-900">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl">
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Identity Verification Section (Optional for Demo) */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-6">Identity Verification</h3>
            
            <div className="space-y-5">
              {/* ID Type */}
              <div className="space-y-1.5">
                <label className="block text-base font-bold text-slate-900">
                  Valid ID Type
                </label>
                <Select value={validIdType} onValueChange={setValidIdType}>
                  <SelectTrigger className="h-14 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 font-medium text-slate-900">
                    <SelectValue placeholder="Select ID Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl">
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="drivers_license">Driver's License</SelectItem>
                    <SelectItem value="national_id">National ID (PhilID)</SelectItem>
                    <SelectItem value="umid">UMID</SelectItem>
                    <SelectItem value="voters_id">Voter's ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ID Number */}
              <div className="space-y-1.5">
                <label htmlFor="validIdNumber" className="block text-base font-bold text-slate-900">
                  ID Number
                </label>
                <Input
                  id="validIdNumber"
                  type="text"
                  value={validIdNumber}
                  onChange={(e) => setValidIdNumber(e.target.value)}
                  placeholder="Enter ID number"
                  className="h-14 text-base px-5 bg-gray-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-gray-400 font-medium"
                />
              </div>

              {/* Photo Capture Segment */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                {/* Selfie Capture */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 px-1">Take Selfie</label>
                  <button
                    type="button"
                    onClick={() => selfieInputRef.current?.click()}
                    className="w-full aspect-square rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:bg-gray-200 transition-colors overflow-hidden relative"
                  >
                    {selfiePhoto ? (
                      <img src={selfiePhoto} alt="Selfie" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tap to Snap</span>
                      </>
                    )}
                    <input
                      type="file"
                      ref={selfieInputRef}
                      className="hidden"
                      accept="image/*"
                      capture="user"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => setSelfiePhoto(reader.result as string)
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </button>
                </div>

                {/* ID Photo Capture */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 px-1">ID Front</label>
                  <button
                    type="button"
                    onClick={() => idInputRef.current?.click()}
                    className="w-full aspect-square rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:bg-gray-200 transition-colors overflow-hidden relative"
                  >
                    {idPhoto ? (
                      <img src={idPhoto} alt="ID Photo" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Upload ID</span>
                      </>
                    )}
                    <input
                      type="file"
                      ref={idInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => setIdPhoto(reader.result as string)
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Beneficiary Information Section */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-6">Beneficiary Information</h3>
            
            <div className="space-y-5">
              {/* Beneficiary Name */}
              <div className="space-y-1.5">
                <label htmlFor="beneficiaryName" className="block text-base font-bold text-slate-900">
                  Beneficiary Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="beneficiaryName"
                    type="text"
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    placeholder="Enter full name"
                    className="h-14 text-base pl-12 bg-gray-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-gray-400 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Relationship */}
              <div className="space-y-1.5">
                <label htmlFor="beneficiaryRelation" className="block text-base font-bold text-slate-900">
                  Relationship
                </label>
                <div className="relative">
                  <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="beneficiaryRelation"
                    type="text"
                    value={beneficiaryRelation}
                    onChange={(e) => setBeneficiaryRelation(e.target.value)}
                    placeholder="e.g. Spouse, Child, Parent"
                    className="h-14 text-base pl-12 bg-gray-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-gray-400 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Beneficiary Birthday */}
              <div className="space-y-1.5">
                <label htmlFor="beneficiaryBirthday" className="block text-base font-bold text-slate-900">
                  Beneficiary Birthday
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="beneficiaryBirthday"
                    type="date"
                    value={beneficiaryBirthday}
                    onChange={(e) => setBeneficiaryBirthday(e.target.value)}
                    className="h-14 text-base pl-12 bg-gray-100 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all font-medium"
                  />
                </div>
                <p className="text-xs text-slate-400 px-1">Optional</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 pb-4">
            <Button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full h-14 text-base font-bold bg-black hover:scale-[1.02] active:scale-95 text-white rounded-full transition-all shadow-premium"
            >
              {isLoading ? "Creating..." : "Continue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  )
}
