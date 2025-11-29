import React from 'react'
import {Schedule as ScheduleType} from '@/sanity.types'
import CustomPortableText from '@/app/components/PortableText'
import {type PortableTextBlock} from 'next-sanity'

interface ScheduleProps {
  block: ScheduleType
  index: number
}

const Schedule: React.FC<ScheduleProps> = ({block}) => {
  const {heading, topText, days, bottomText} = block

  if (!days || days.length === 0) {
    return null
  }

  // Dynamic grid columns based on number of days
  const gridColsClass =
    days.length === 1
      ? 'md:grid-cols-1'
      : days.length === 2
        ? 'md:grid-cols-2'
        : days.length === 3
          ? 'md:grid-cols-3'
          : days.length === 4
            ? 'md:grid-cols-2 lg:grid-cols-4'
            : 'md:grid-cols-2 lg:grid-cols-5'

  return (
    <div className="relative overflow-hidden bg-nexus-coral-light/20">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgb(243 244 246 / 0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      ></div>

      <div className="relative container mx-auto px-6 py-16 md:py-24">
        {/* Heading */}
        {heading && (
          <div className="mb-8 md:mb-12 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-nexus-navy font-serif">
              {heading}
            </h2>
          </div>
        )}

        {/* Top text */}
        {topText && (
          <div className="mb-14 md:mb-14 max-w-4xl mx-auto text-center md:text-left">
            <div className="text-base md:text-lg lg:text-lg text-gray-700 leading-relaxed font-light">
              <CustomPortableText value={topText as PortableTextBlock[]} />
            </div>
          </div>
        )}

        {/* Mobile: Stacked layout */}
        <div className="md:hidden space-y-6 mb-14">
          {days.map((day, index) => (
            <div
              key={day._key || index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden border border-nexus-coral/20"
            >
              {/* Day header */}
              <div className="relative bg-nexus-navy px-6 py-6">
                <h3 className="relative text-white text-2xl font-serif font-semibold text-center tracking-wide">
                  {day.dayTitle}
                </h3>
              </div>

              {/* Day content */}
              <div className="py-8 px-6">
                <div className="space-y-4">
                  {day.items?.map((item, itemIndex) => (
                    <div key={itemIndex} className="group relative">
                      <p className="text-center py-2.5 text-base text-gray-800 font-light">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Grid layout */}
        <div className={`hidden md:grid ${gridColsClass} gap-8 mb-14 md:mb-20 max-w-4xl mx-auto`}>
          {days.map((day, index) => (
            <div
              key={day._key || index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden border border-nexus-coral/20"
            >
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-nexus-coral/10 to-transparent rounded-bl-full"></div>

              {/* Day header */}
              <div className="relative bg-gradient-to-br from-nexus-navy via-nexus-navy-dark to-nexus-navy px-6 py-8">
                <h3 className="relative text-white text-lg lg:text-2xl font-semibold font-serif text-center uppercase">
                  {day.dayTitle}
                </h3>
              </div>

              {/* Day content */}
              <div className="relative pt-8 pb-8 px-8 lg:px-10">
                <div className="space-y-5">
                  {day.items?.map((item, itemIndex) => (
                    <div key={itemIndex} className="group/item relative">
                      <p className="text-center text-base lg:text-md text-gray-800 font-light group-hover/item:text-nexus-navy transition-colors duration-300">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom decorative accent */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-nexus-coral/30 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Bottom text */}
        {bottomText && (
          <div className="max-w-4xl mx-auto text-center md:text-left">
            <div className="text-base text-gray-700 leading-relaxed font-light">
              <CustomPortableText value={bottomText as PortableTextBlock[]} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Schedule
