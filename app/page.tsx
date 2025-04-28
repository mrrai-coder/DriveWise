import Image from "next/image"
import Link from "next/link"
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ArrowRight,
  User,
  Search,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar */}
      <div className="bg-navy-700 text-white">
        <div className="container mx-auto flex justify-between items-center px-4 py-2">
          <div className="flex space-x-6">
            <Link href="#" className="font-medium hover:text-blue-300 transition-colors">
              CARS
            </Link>
            <Link href="#" className="font-medium hover:text-blue-300 transition-colors">
              BIKES
            </Link>
            <Link href="#" className="font-medium hover:text-blue-300 transition-colors">
              SERVICES
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href="#" aria-label="Facebook" className="hover:text-blue-300 transition-colors">
              <Facebook size={18} />
            </Link>
            <Link href="#" aria-label="Instagram" className="hover:text-blue-300 transition-colors">
              <Instagram size={18} />
            </Link>
            <Link href="#" aria-label="Twitter" className="hover:text-blue-300 transition-colors">
              <Twitter size={18} />
            </Link>
            <Link href="#" aria-label="Youtube" className="hover:text-blue-300 transition-colors">
              <Youtube size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-white py-4 shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <Link href="/" className="mb-4 md:mb-0">
            <Image
              src="/placeholder.svg?height=50&width=180&text=CARFAME"
              alt="CarFame Logo"
              width={180}
              height={50}
              className="h-10 w-auto"
            />
          </Link>

          <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base">
            <Link href="#" className="hover:text-blue-600 transition-colors">
              Used cars
            </Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">
              New cars
            </Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">
              New Car Prices
            </Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">
              Used Car Prices
            </Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">
              Sell my car
            </Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">
              Value my car
            </Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">
              Car Reviews
            </Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">
              Carfame videos
            </Link>
          </nav>

          <Link
            href="/signup"
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          >
            <User size={18} className="mr-2" />
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-navy-900 to-navy-800 text-white">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center opacity-30"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-xl mb-2">Car fame</h2>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Best online platform <span className="block md:inline">to buy</span>{" "}
              <span className="block">and sell used cars</span>
            </h1>
            <div className="w-32 h-1 bg-blue-400 mb-6"></div>
            <p className="text-lg mb-8">Sell your car for what it's really worth quicker than ever</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center">
                <Search size={18} className="mr-2" />
                SEARCH CAR
              </button>
              <Link href="#" className="flex items-center text-white hover:text-blue-300 transition-colors">
                Find out more <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Car Search Form */}
      <section className="py-8 -mt-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-navy-800">Find your perfect car</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <select className="w-full p-3 border rounded-md appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                  <option>Make</option>
                  <option>Toyota</option>
                  <option>Honda</option>
                  <option>Suzuki</option>
                  <option>Mercedes</option>
                  <option>Volkswagen</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select className="w-full p-3 border rounded-md appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                  <option>Model</option>
                  <option>Corolla</option>
                  <option>Civic</option>
                  <option>Swift</option>
                  <option>C-Class</option>
                  <option>Golf</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select className="w-full p-3 border rounded-md appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                  <option>City</option>
                  <option>Lahore</option>
                  <option>Karachi</option>
                  <option>Islamabad</option>
                  <option>Peshawar</option>
                  <option>Quetta</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md font-medium transition-colors">
                445 Cars
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-navy-800">Featured Cars</h2>
            <Link href="#" className="text-blue-600 hover:text-blue-800 flex items-center transition-colors">
              View all <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={`/placeholder.svg?height=300&width=500&text=Car+${item}`}
                    alt={`Featured Car ${item}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                    Featured
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">Toyota Corolla {2020 + item}</h3>
                  <p className="text-gray-600 mb-2">Lahore, Pakistan</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xl text-navy-800">PKR {1200000 + item * 100000}</span>
                    <span className="text-sm text-gray-500">Posted 2 days ago</span>
                  </div>
                  <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-600">Year:</span>
                      <span className="ml-1 font-medium">{2020 + item}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600">Mileage:</span>
                      <span className="ml-1 font-medium">{10000 + item * 5000} km</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600">Fuel:</span>
                      <span className="ml-1 font-medium">Petrol</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600">Transmission:</span>
                      <span className="ml-1 font-medium">Automatic</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Car Brands */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-navy-800">
            Popular New Car Brands in Lahore
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {/* Car Brand Logos */}
            {["Toyota", "Mercedes", "Suzuki", "Honda", "Volkswagen"].map((brand, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
              >
                <Image
                  src={`/placeholder.svg?height=80&width=80&text=${brand}`}
                  alt={`${brand} logo`}
                  width={80}
                  height={80}
                  className="h-16 w-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-navy-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Why Choose CarFame?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Best Market Value</h3>
              <p className="text-blue-100">
                Get the best price for your car with our market analysis and valuation tools.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Listings</h3>
              <p className="text-blue-100">
                All our listings are verified to ensure you get genuine and quality vehicles.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quick Process</h3>
              <p className="text-blue-100">
                Our streamlined process ensures you can buy or sell your car quickly and efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-navy-800">What Our Customers Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">{["JD", "SK", "MR"][item - 1]}</span>
                  </div>
                  <div>
                    <h3 className="font-bold">{["John Doe", "Sarah Khan", "Muhammad Raza"][item - 1]}</h3>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "
                  {
                    [
                      "I sold my car through CarFame and got a great price. The process was smooth and the team was very helpful throughout.",
                      "Found my dream car on CarFame at a reasonable price. The verification process gave me confidence in my purchase.",
                      "CarFame made selling my old car and buying a new one so easy. Their valuation was fair and the listing process was simple.",
                    ][item - 1]
                  }
                  "
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Buy or Sell Your Car?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who have successfully bought and sold cars on CarFame.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Sell My Car
            </Link>
            <Link
              href="#"
              className="bg-navy-800 text-white hover:bg-navy-900 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Browse Cars
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 text-white pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Image
                src="/placeholder.svg?height=50&width=180&text=CARFAME"
                alt="CarFame Logo"
                width={180}
                height={50}
                className="h-10 w-auto mb-4"
              />
              <p className="text-blue-100 mb-4">
                Pakistan's premier online platform for buying and selling cars. Get the best value for your vehicle.
              </p>
              <div className="flex space-x-4">
                <Link href="#" aria-label="Facebook" className="hover:text-blue-400 transition-colors">
                  <Facebook size={20} />
                </Link>
                <Link href="#" aria-label="Instagram" className="hover:text-blue-400 transition-colors">
                  <Instagram size={20} />
                </Link>
                <Link href="#" aria-label="Twitter" className="hover:text-blue-400 transition-colors">
                  <Twitter size={20} />
                </Link>
                <Link href="#" aria-label="Youtube" className="hover:text-blue-400 transition-colors">
                  <Youtube size={20} />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-blue-100 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-100 hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-100 hover:text-white transition-colors">
                    Car Valuation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-100 hover:text-white transition-colors">
                    Car Financing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-100 hover:text-white transition-colors">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Car Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-blue-100 hover:text-white transition-colors">
                    Sedans
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-100 hover:text-white transition-colors">
                    SUVs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-100 hover:text-white transition-colors">
                    Hatchbacks
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-100 hover:text-white transition-colors">
                    Luxury Cars
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-100 hover:text-white transition-colors">
                    Commercial Vehicles
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin size={20} className="mr-2 mt-1 flex-shrink-0" />
                  <span className="text-blue-100">123 Main Street, Lahore, Pakistan</span>
                </li>
                <li className="flex items-center">
                  <Phone size={20} className="mr-2 flex-shrink-0" />
                  <span className="text-blue-100">+92 300 1234567</span>
                </li>
                <li className="flex items-center">
                  <Mail size={20} className="mr-2 flex-shrink-0" />
                  <span className="text-blue-100">info@carfame.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-navy-700 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-200 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} CarFame. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="#" className="text-blue-200 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-blue-200 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-blue-200 hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
