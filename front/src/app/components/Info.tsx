"use client"

import { Calendar, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function InfoSection() {
  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-playfair text-text-primary mb-8 font-jp">インフォメーション</h3>

      {/* 劇場案内 */}
      <div className="card-luxury p-6">
        <div className="space-y-6">
          <div>
            <h4 className="text-xl font-medium text-gold mb-4 font-jp">劇場案内</h4>
            <div className="aspect-video relative mb-4 overflow-hidden rounded">
              <Image src="/images/theater-interior-1.png" alt="劇場内観" fill className="object-cover" />
            </div>
            <p className="text-text-muted text-sm mb-4 font-shippori font-jp">
              最高級の設備と洗練された空間で、特別な映画体験をお楽しみください。
            </p>
            <Link
              href="/access"
              className="text-gold hover:text-gold-light transition-colors text-sm font-medium font-shippori font-jp"
            >
              詳細を見る →
            </Link>
          </div>

          <div className="border-t border-accent/20"></div>

          {/* アクセス情報 */}
          <div>
            <h4 className="text-xl font-medium text-gold mb-4 font-jp">アクセス</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="text-text-secondary text-sm font-medium font-shippori font-jp">所在地</p>
                  <p className="text-text-muted text-sm font-shippori font-jp">
                    名古屋市中村区名駅4-27-1
                    <br />
                    スパイラルタワーズ
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="text-text-secondary text-sm font-medium font-shippori font-jp">最寄り駅</p>
                  <p className="text-text-muted text-sm font-shippori font-jp">JR名古屋駅 徒歩5分</p>
                </div>
              </div>
            </div>
            <Link
              href="/access"
              className="inline-block mt-4 text-gold hover:text-gold-light transition-colors text-sm font-medium font-shippori font-jp"
            >
              詳細を見る →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
