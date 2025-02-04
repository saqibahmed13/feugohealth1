import { ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 bg-white z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-[#ff6b35] text-3xl font-bold">
            fuego
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              HOME
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              ABOUT FUEGO
            </Link>
            <div className="relative group">
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                PRODUCTS
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>
            <Link href="/clients" className="text-gray-600 hover:text-gray-900">
              CLIENTS
            </Link>
            <Link href="/sustainability" className="text-gray-600 hover:text-gray-900">
              SUSTAINABILITY
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              CONTACT US
            </Link>
            <div className="relative group">
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                PARTNER LOGIN
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen pt-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-98eDbUEZTDKidqqSO3xkbX5Qi6iL9R.png"
            alt="Modern office interior with desks and orange wall panel"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#661111]/90" />

        <div className="relative z-10 container mx-auto px-4 pt-20">
          <div className="max-w-xl text-white ml-auto">
            <h1 className="text-4xl font-light mb-8">making your office worth the commute</h1>
            <p className="text-xl leading-relaxed">
              Fuego combines innovation & technology to bring you a set of refreshing new products that help create a
              workplace that is safe, comfortable, and productive. Our furniture is designed to encourage people to
              connect with each other making your office a desirable space to be in again.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

