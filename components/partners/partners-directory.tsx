"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  { id: "all", label: "All" },
  { id: "hotels", label: "Hotels" },
  { id: "activities", label: "Activities" },
  { id: "dining", label: "Dining" },
  { id: "water-sports", label: "Water Sports" },
]

const partners = [
  {
    id: "lighthouse",
    name: "Lighthouse Marina Resort",
    category: "hotels",
    logo: "/images/lighthouse-marina-logo.png",
    discount: 25,
  },
  {
    id: "zoobic",
    name: "Zoobic Safari",
    category: "activities",
    logo: "/images/zoobic-safari-logo.jpeg",
    discount: 20,
  },
  {
    id: "labanca",
    name: "La Banca Cruises",
    category: "water-sports",
    logo: "/images/la-banca-cruises-logo.png",
    discount: 15,
  },
  {
    id: "treetop",
    name: "Tree Top Adventure",
    category: "activities",
    logo: "/images/tree-top-adventure-logo.jpeg",
    discount: 20,
  },
  {
    id: "sailing",
    name: "Subic Sailing",
    category: "water-sports",
    logo: "/images/subic-sailing-hero.jpg",
    discount: 15,
  },
  {
    id: "funtastic",
    name: "Funtastic Park",
    category: "activities",
    logo: "/images/funtastic-park-logo.jpeg",
    discount: 20,
  },
  {
    id: "bestwestern",
    name: "Best Western Plus Hotel",
    category: "hotels",
    logo: "/images/best-western-subic-logo.webp",
    discount: 20,
  },
  {
    id: "networx",
    name: "NetworX Jetsports",
    category: "water-sports",
    logo: "/images/king-of-watersports.jpg",
    discount: 15,
  },
  {
    id: "icc",
    name: "ICC Zambales",
    category: "activities",
    logo: "/images/icc-zambales-logo.png",
    discount: 15,
  },
  {
    id: "standard",
    name: "Standard Insurance",
    category: "services",
    logo: "/images/standard-insurance-logo.png",
    discount: 10,
  },
  {
    id: "assist",
    name: "Assist America",
    category: "services",
    logo: "/images/assist-america-logo.jpg",
    discount: 10,
  },
]

interface PartnersDirectoryProps {
  defaultCategory?: string
}

export function PartnersDirectory({ defaultCategory }: PartnersDirectoryProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || defaultCategory || "all"
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPartners = partners.filter((partner) => {
    const matchesCategory = activeCategory === "all" || partner.category === activeCategory
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-slate-900 mb-4">Partners</h1>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search partners"
              className="pl-10 h-11 shadow-sm"
            />
          </div>
        </div>

      {/* Category tabs */}
      <div className="max-w-md mx-auto px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all ${
                activeCategory === cat.id
                  ? "bg-black text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Partner Grid */}
    <div className="max-w-md mx-auto px-4 py-4 pb-24">
      <div className="grid grid-cols-2 gap-4">
        {filteredPartners.map((partner) => (
          <div
            key={partner.id}
            onClick={() => router.push(`/partners/${partner.id}`)}
            className="group relative overflow-hidden rounded-[1.5rem] bg-white p-4 shadow-sm hover:shadow-premium transition-all duration-300 cursor-pointer border border-gray-100"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-500">
              <img
                src={partner.logo || "/placeholder.svg"}
                alt={partner.name}
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="text-center">
              <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1 group-hover:text-subic-blue transition-colors">{partner.name}</h3>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-3">
                {partner.category.replace("-", " ")}
              </p>
              
              <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 border border-green-100">
                <span className="text-[10px] font-bold text-green-700">{partner.discount}% OFF</span>
              </div>
            </div>
          </div>
        ))}
      </div>

        {filteredPartners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No partners found</p>
          </div>
        )}
      </div>
    </div>
  )
}
