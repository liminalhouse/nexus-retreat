'use client'

import {useCallback} from 'react'
import {Stack, Text, TextInput, Flex, Box} from '@sanity/ui'
import {set, unset} from 'sanity'
import type {StringInputProps} from 'sanity'

/**
 * Custom datetime input that displays and accepts Eastern Time.
 * Internally stores as ISO string (UTC), but UI shows Eastern Time.
 */
export function EasternTimeInput(props: StringInputProps) {
  const {value, onChange, readOnly} = props

  // Convert UTC ISO string to Eastern Time for display
  const getEasternDateTime = (isoString: string | undefined) => {
    if (!isoString) return {date: '', time: ''}

    const date = new Date(isoString)
    // Format in Eastern Time
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    return {
      date: formatter.format(date), // YYYY-MM-DD format
      time: timeFormatter.format(date), // HH:MM format
    }
  }

  // Convert Eastern Time input to UTC ISO string for storage
  const toUTCISOString = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) return undefined

    // Parse the date and time components
    const [year, month, day] = dateStr.split('-').map(Number)
    const [hours, minutes] = timeStr.split(':').map(Number)

    // Create a temp date to check if this date is in DST
    const tempDate = new Date(Date.UTC(year, month - 1, day, 12, 0))

    // Check if this date is in EDT or EST
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      timeZoneName: 'short',
    })
    const parts = formatter.formatToParts(tempDate)
    const tzName = parts.find((p) => p.type === 'timeZoneName')?.value

    // EDT = UTC-4 (240 min), EST = UTC-5 (300 min)
    const offsetMinutes = tzName === 'EDT' ? 240 : 300

    // Create UTC time: input is in Eastern, so add offset to get UTC
    const utcMs = Date.UTC(year, month - 1, day, hours, minutes) + offsetMinutes * 60 * 1000

    return new Date(utcMs).toISOString()
  }

  const {date, time} = getEasternDateTime(value)

  const handleDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = event.target.value
      if (newDate && time) {
        const isoString = toUTCISOString(newDate, time)
        onChange(isoString ? set(isoString) : unset())
      } else if (newDate && !time) {
        // Set a default time of 09:00 if only date is provided
        const isoString = toUTCISOString(newDate, '09:00')
        onChange(isoString ? set(isoString) : unset())
      } else {
        onChange(unset())
      }
    },
    [onChange, time]
  )

  const handleTimeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = event.target.value
      if (date && newTime) {
        const isoString = toUTCISOString(date, newTime)
        onChange(isoString ? set(isoString) : unset())
      } else {
        onChange(unset())
      }
    },
    [onChange, date]
  )

  return (
    <Stack space={3}>
      <Flex gap={3}>
        <Box flex={1}>
          <Stack space={2}>
            <Text size={1} weight="medium">
              Date
            </Text>
            <TextInput
              type="date"
              value={date}
              onChange={handleDateChange}
              readOnly={readOnly}
            />
          </Stack>
        </Box>
        <Box flex={1}>
          <Stack space={2}>
            <Text size={1} weight="medium">
              Time (Eastern)
            </Text>
            <TextInput
              type="time"
              value={time}
              onChange={handleTimeChange}
              readOnly={readOnly}
            />
          </Stack>
        </Box>
      </Flex>
      <Text size={1} muted>
        Times are in Eastern Time (ET) and automatically adjust for daylight saving.
      </Text>
    </Stack>
  )
}
