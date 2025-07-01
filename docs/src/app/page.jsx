import { SalarySimulator } from "@/components/SalarySimulator"

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            saldo
          </h1>
          <p className="text-xl text-gray-600">
            Portuguese Salary Calculator
          </p>
        </div>
        <SalarySimulator />
      </div>
    </div>
  )
}
