"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Bell,
  Shield,
  Leaf,
  Hotel,
  Waves,
  Utensils,
  MapPin,
  Grid3X3,
  ChevronRight,
  Anchor,
  QrCode,
  CreditCard,
  Plus,
  ArrowLeftRight,
  Ticket,
  Headphones,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUser, discountPercentages } from "@/lib/user-context"

const quickActions = [
  { id: "scan", name: "Scan", icon: QrCode },
  { id: "pay", name: "Pay", icon: CreditCard },
  { id: "topup", name: "Top Up", icon: Plus },
  { id: "transfer", name: "Transfer", icon: ArrowLeftRight },
  { id: "vouchers", name: "Vouchers", icon: Ticket },
  { id: "support", name: "Support", icon: Headphones },
]

const categories = [
  {
    id: "hotels",
    name: "Hotels",
    icon: Hotel,
    color: "#0A74DA",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
  },
  {
    id: "activities",
    name: "Activities",
    icon: MapPin,
    color: "#FF6B35",
    bgColor: "bg-orange-100",
    textColor: "text-orange-600",
  },
  {
    id: "water-sports",
    name: "Water Sports",
    icon: Waves,
    color: "#06B6D4",
    bgColor: "bg-cyan-100",
    textColor: "text-cyan-600",
  },
  {
    id: "dining",
    name: "Dining",
    icon: Utensils,
    color: "#EF4444",
    bgColor: "bg-red-100",
    textColor: "text-red-600",
  },
  {
    id: "services",
    name: "Insurance",
    icon: Shield,
    color: "#00B14F",
    bgColor: "bg-green-100",
    textColor: "text-green-600",
  },
  {
    id: "all",
    name: "All Partners",
    icon: Grid3X3,
    color: "#6B7280",
    bgColor: "bg-slate-100",
    textColor: "text-slate-600",
  },
]

const featuredOffers = [
  {
    id: "1",
    partnerName: "Lighthouse Marina Resort",
    title: "Sunset Dinner Cruise",
    image: "/images/7c5eba-268dcc5019d54475ae66c5bc17a5c336-mv2.png",
  },
  {
    id: "2",
    partnerName: "Zoobic Safari",
    title: "Tiger Encounter Experience",
    image: "/images/3.jpeg",
  },
  {
    id: "3",
    partnerName: "La Banca Cruises",
    title: "Private Yacht Charter",
    image: "/images/a97d3f-f3e8aad1f46446e58a87dda0cae5d7b9-mv2.png",
  },
  {
    id: "4",
    partnerName: "Tree Top Adventure",
    title: "Zipline & Nature Trail",
    image: "/images/tree-20top.jpeg",
  },
  {
    id: "5",
    partnerName: "Subic Sailing",
    title: "Weekend Sailing Lessons",
    image: "/images/7c5eba-df2c5ae831f247eab0d0f46ba54f996a-mv2-d-2880-1616-s-2.jpg",
  },
]

const tierConfig = {
  starter: {
    borderColor: "border-l-[#0A74DA]",
    gradientFrom: "from-[#0A74DA]",
    gradientTo: "to-blue-400",
    label: "Starter Member",
    insurance: 25000,
    discount: 5,
    benefits: [],
    showUpgrade: true,
    upgradeText: "Upgrade Membership",
  },
  basic: {
    borderColor: "border-l-green-500",
    gradientFrom: "from-green-500",
    gradientTo: "to-green-400",
    label: "Basic Member",
    insurance: 100000,
    discount: 10,
    benefits: [],
    showUpgrade: true,
    upgradeText: "Upgrade to Premium",
  },
  premium: {
    borderColor: "border-l-orange-500",
    gradientFrom: "from-orange-500",
    gradientTo: "to-orange-400",
    label: "Premium Member",
    insurance: 500000,
    discount: 20,
    benefits: ["1 Free Hotel Night"],
    showUpgrade: true,
    upgradeText: "Upgrade to Elite",
  },
  elite: {
    borderColor: "border-l-[#0A74DA]",
    gradientFrom: "from-[#0A74DA]",
    gradientTo: "to-blue-400",
    label: "Elite Member",
    insurance: 1000000,
    discount: 25,
    benefits: ["Yacht Cruise Available", "1 Hotel Night"],
    showUpgrade: false,
    upgradeText: "",
  },
}

export function HomeDashboard() {
  const { user } = useUser()
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)

  const firstName = user?.name?.split(" ")[0] || "Guest"
  const tier = user?.tier || "starter"
  const config = tierConfig[tier as keyof typeof tierConfig] || tierConfig.starter
  const userDiscount = discountPercentages[tier] || 5

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Welcome back,</p>
            <h1 className="text-lg font-bold text-slate-900">Hi, {firstName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-slate-100 relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Avatar className="w-10 h-10 border-2 border-slate-200">
              <AvatarFallback className="bg-[#0A74DA] text-white font-semibold">{firstName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-6">
        {/* Membership Card */}
        <Card className={`shadow-sm border-0 overflow-hidden border-l-4 ${config.borderColor}`}>
          <div className={`h-1 bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo}`} />
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Badge
                className={`bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} hover:opacity-90 text-white px-3 py-1`}
              >
                {config.label}
              </Badge>
              {tier === "elite" && (
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  SBMA 2025 Supporter
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#0A74DA]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Insurance</p>
                  <p className="text-sm font-semibold text-slate-900">₱{config.insurance.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Discount</p>
                  <p className="text-sm font-semibold text-slate-900">{config.discount}% Off</p>
                </div>
              </div>
            </div>

            {config.benefits.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {config.benefits.map((benefit, index) => (
                  <Badge key={index} variant="outline" className="text-slate-600 border-slate-200 bg-slate-50">
                    {benefit.includes("Yacht") && <Anchor className="w-3 h-3 mr-1" />}
                    {benefit.includes("Hotel") && <Hotel className="w-3 h-3 mr-1" />}
                    {benefit}
                  </Badge>
                ))}
              </div>
            )}

            {config.showUpgrade && (
              <Button
                onClick={() => router.push("/membership")}
                variant="outline"
                className="w-full h-10 font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                {config.upgradeText}
              </Button>
            )}
          </CardContent>
        </Card>

        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <button key={action.id} className="flex flex-col items-center gap-2">
                {/* Neumorphic circle button */}
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-slate-100 border border-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_4px_8px_rgba(0,0,0,0.04)] hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.08),0_6px_12px_rgba(0,0,0,0.06)] transition-shadow">
                  <action.icon className="w-7 h-7 text-slate-700" />
                </div>
                <span className="text-xs font-medium text-slate-600">{action.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Grid - Browse Services */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Browse Services</h2>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => router.push(`/partners?category=${category.id}`)}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category.bgColor}`}>
                  <category.icon className={`w-6 h-6 ${category.textColor}`} />
                </div>
                <span className="text-xs font-medium text-slate-700">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Offers */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-900">Featured Offers</h2>
            <button
              onClick={() => router.push("/partners")}
              className="text-sm text-[#0A74DA] font-medium flex items-center gap-1"
            >
              See all <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {featuredOffers.map((offer) => (
              <div key={offer.id} className="flex-shrink-0 w-64 snap-start">
                <Card className="overflow-hidden shadow-sm border-0 h-full">
                  <div className="relative h-32">
                    <img
                      src={offer.image || "/placeholder.svg"}
                      alt={offer.title}
                      className="w-full h-full object-cover bg-slate-100"
                    />
                    <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-500 text-white">
                      {userDiscount}% OFF
                    </Badge>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-xs text-slate-500">{offer.partnerName}</p>
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">{offer.title}</h3>
                    <button className="text-xs text-[#0A74DA] font-medium mt-2">View Details</button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
