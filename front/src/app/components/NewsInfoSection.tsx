"use client"

import { NewsSection } from "./News"
import { InfoSection } from "./Info"

export const NewsInfoSection = () => {
  return (
    <section className="py-20">
      <div className="container-luxury">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4 font-en">NEWS & INFORMATION</h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto font-shippori">
            <span className="font-jp">最新のお知らせと劇場情報をお届けします</span>
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <NewsSection />
          </div>
          <div>
            <InfoSection />
          </div>
        </div>
      </div>
    </section>
  )
}
