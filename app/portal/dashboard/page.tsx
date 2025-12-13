"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, LogOut, Calendar, DollarSign, Users, Star, Check, X, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const metrics = [
  { id: "bookings", label: "Bookings Today", value: "12", icon: Calendar, color: "text-blue-600 bg-blue-100" },
  {
    id: "revenue",
    label: "Revenue (Month)",
    value: "₱245,000",
    icon: DollarSign,
    color: "text-green-600 bg-green-100",
  },
  { id: "members", label: "Elite Members", value: "89", icon: Users, color: "text-purple-600 bg-purple-100" },
  { id: "rating", label: "Avg Rating", value: "4.8", icon: Star, color: "text-yellow-600 bg-yellow-100" },
]

const initialRequests = [
  {
    id: "1",
    guestName: "Maria Santos",
    tier: "elite",
    request: "Dinner reservation for 4, sunset view preferred",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: "pending" as const,
  },
  {
    id: "2",
    guestName: "John Cruz",
    tier: "premium",
    request: "Room upgrade inquiry for weekend stay",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: "pending" as const,
  },
  {
    id: "3",
    guestName: "Ana Reyes",
    tier: "elite",
    request: "Private yacht dinner arrangement",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: "pending" as const,
  },
]

const revenueData = [
  { day: "1", revenue: 8500 },
  { day: "5", revenue: 12000 },
  { day: "10", revenue: 9800 },
  { day: "15", revenue: 15200 },
  { day: "20", revenue: 11000 },
  { day: "25", revenue: 18500 },
  { day: "30", revenue: 14200 },
]

export default function PortalDashboard() {
  const router = useRouter()
  const [requests, setRequests] = useState(initialRequests)
  const [whatsappEnabled, setWhatsappEnabled] = useState(true)

  const handleAccept = (id: string) => {
    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "accepted" as const } : req)))
  }

  const handleDecline = (id: string) => {
    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "declined" as const } : req)))
  }

  const formatTime = (date: Date) => {
    const mins = Math.floor((Date.now() - date.getTime()) / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    return `${Math.floor(mins / 60)}h ago`
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/7c5eba-268dcc5019d54475ae66c5bc17a5c336-mv2.png"
              alt="Lighthouse Marina"
              className="w-10 h-10 rounded-lg object-contain bg-slate-100"
            />
            <div>
              <h1 className="text-sm font-bold text-slate-900">Lighthouse Marina Resort</h1>
              <p className="text-xs text-slate-500">Partner Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-slate-100 relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button onClick={() => router.push("/portal")} className="p-2 rounded-full hover:bg-slate-100">
              <LogOut className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metrics.map((metric) => (
            <Card key={metric.id} className="shadow-sm border-0">
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${metric.color}`}>
                  <metric.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                <p className="text-xs text-slate-500">{metric.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Requests */}
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">New Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-[#0A74DA] text-white text-sm">{req.guestName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900 text-sm">{req.guestName}</span>
                    <Badge
                      variant="outline"
                      className={
                        req.tier === "elite"
                          ? "text-blue-600 border-blue-200 bg-blue-50"
                          : "text-green-600 border-green-200 bg-green-50"
                      }
                    >
                      {req.tier.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{req.request}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatTime(req.timestamp)}</p>
                </div>
                {req.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAccept(req.id)}
                      className="h-8 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDecline(req.id)}
                      className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Badge
                    className={req.status === "accepted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                  >
                    {req.status}
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Revenue (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`₱${value.toLocaleString()}`, "Revenue"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#0A74DA" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Integration */}
        <Card className="shadow-sm border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <Label htmlFor="whatsapp" className="text-sm font-semibold text-slate-900">
                    Forward to WhatsApp
                  </Label>
                  <p className="text-xs text-slate-500">+63 917 123 4567</p>
                </div>
              </div>
              <Switch id="whatsapp" checked={whatsappEnabled} onCheckedChange={setWhatsappEnabled} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
