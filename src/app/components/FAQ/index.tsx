'use client'

import AccordionItem from '../Accordion/StyledAccordionItem'
import Accordion from '../Accordion/StyledAccordion'
import styles from './faq.module.scss'

const FAQ = () => {
    return (
        <div className={styles.wrapper}>
            <Accordion>
                <h1 style={{ marginBottom: '1rem' }}>Q&A</h1>
                <br />
                <AccordionItem
                    header="This is my first time being invited, what can I expect?"
                    id="first-time-attendee"
                >
                    <p>
                        This invitation-only retreat has gathered a
                        distinguished group of global leaders, including sports
                        executives, world leaders, CEOs, and influential figures
                        across various sectors. Attendees have consistently
                        included owners of roughly 100 professional teams, whose
                        collective business ventures exceed $10 trillion in
                        economic value and whose philanthropic endeavors impact
                        millions globally.
                    </p>
                    <p>
                        Think of this as a retreat, rather than a conference.
                        Spouses and partners are welcome. The off-the-record
                        program is set in a relaxed living-room setting and
                        covers topics ranging from geopolitics, economics,
                        leadership, health, longevity, emerging trends, IP,
                        media, and entertainment. Guests will have the option to
                        participate in diverse activities, and exclusive
                        breakout sessions with speakers. The evenings will be a
                        moment to enjoy good food and great conversation at
                        curated dinners and late night receptions.
                    </p>
                    <p>
                        The event kicks off the afternoon of March 18th with a
                        reception, followed by dinner with a headline speaker.
                        Programming and activities continue on the 19th with
                        early morning breakfasts and activities, programming,
                        dinner, and a late-night reception. Early morning
                        activities, and speakers will continue on the 20th and
                        conclude mid-morning. The full schedule will be
                        available on the website closer to the event.
                    </p>
                </AccordionItem>
                <AccordionItem
                    header="Why is the retreat moving this year?"
                    id="why-move-retreat"
                >
                    <p>
                        Our objective remains to create an intimate,
                        off-the-record, and highly exclusive gathering. From new
                        interactive experiences and fun activities to
                        exceptional dinners, dynamic programming, and more, this
                        next chapter promises something extraordinary.
                    </p>
                    <p>
                        The Boca Raton Beach Club is a world-renowned resort,
                        helping to create unparalleled opportunities to
                        cultivate enduring personal connections and valuable
                        business relationships.
                    </p>
                </AccordionItem>
                <AccordionItem
                    header="Is this now called Nexus?"
                    id="nexus-name"
                >
                    <p>
                        The one-of-a-kind event has evolved into more than a
                        location, inspiring the new name &quot;Nexus&quot;
                        reflective of its evolution and broader ambitions. This
                        gathering, co-hosted by Bruin Capital and Sportico, is
                        truly a unique space where diverse perspectives converge
                        and innovative ideas take shape.
                    </p>
                </AccordionItem>
                <AccordionItem
                    header="Are there any substantive changes guests can expect?"
                    id="substantive-changes"
                >
                    <p>
                        We always strive to make each year better and more
                        exciting, and attendees should expect the same type of
                        exclusive retreat as in previous years. Your time onsite
                        will be filled with engaging conversations, high-touch
                        networking, VIP guests, bespoke activities, fabulous
                        dinners, and, as always, plenty of fun.
                    </p>
                </AccordionItem>
                <AccordionItem
                    header="Will there still be activities like we had in years past?"
                    id="activities"
                >
                    <p>
                        Guests will have the opportunity to take advantage of
                        all the resort has to offer - multiple pools, golf,
                        tennis, pickleball, workouts, water sports, luxurious
                        spa facilities - as well as small-group experiences
                        exclusive to event guests. Our team is happy to help
                        facilitate activities, and we will share in more detail
                        closer to the event.
                    </p>
                </AccordionItem>
                <AccordionItem
                    header="What do I need to know in terms of travel?"
                    id="travel-info"
                >
                    <p>
                        Boca Raton is conveniently situated between Palm Beach
                        and Miami, offers excellent accessibility through three
                        international airports (FLL, PBI, and MIA), as well as
                        Boca Raton Airport (BCT). All four airports have customs
                        for international flights*, and all airports can also
                        accommodate private jets (BCT).
                    </p>
                    <p>
                        Upon arrival, you will have ground transportation
                        arranged on your behalf (at guest&apos;s expense).
                    </p>
                    <strong>Airport transport times:</strong>
                    <ul>
                        <li>FLL (24 miles / 30-35 min)</li>
                        <li>PBI (28 miles / 35-40 min)</li>
                        <li>MIA (45 miles / 60 min)</li>
                        <li>BCT - Boca Raton Executive (5 miles/12 min)*</li>
                    </ul>
                    <br />
                    <small>
                        *BCT currently has customs service Thursday to Monday
                        only,{' '}
                        <a href="https://bocaairport.com/customs-2/">
                            see here
                        </a>{' '}
                        for the most up to date information.{' '}
                    </small>
                </AccordionItem>

                <AccordionItem
                    header="As a guest, what expenses am I responsible for?"
                    id="guest-expenses"
                >
                    <p>
                        All hotel costs (excluding incidentals), meals, and
                        activities will be covered by the event. Ground
                        transportation and non-event activities (e.g. spa
                        services, room service) will be arranged for you at your
                        own cost. Access to the amenities and activity
                        programming of The Boca Raton Club are also
                        included.&nbsp;&nbsp;
                        <a
                            href="https://www.thebocaraton.com/experiences/#!/"
                            target="_blank"
                        >
                            Boca Raton Experiences
                        </a>{' '}
                        can be found here.
                    </p>
                    <p style={{ marginBottom: '0.75rem' }}>
                        The following expenses are also covered by the event:
                    </p>
                    <ul>
                        <li>
                            Access to the{' '}
                            <a
                                href="https://www.thebocaraton.com/experiences/programming/#!/?categoryIds=3730c564-444d-47ff-9ab2-2037b8cbc1df,debe2ada-6e40-4d83-876f-52ac24f20670,334e5c90-4d6c-45b0-95f8-a5166102f128,b96993fd-16d5-4f6d-9940-c13c7d8c6273"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                amenities and activity programming{' '}
                            </a>
                            of The Boca Raton Club
                        </li>
                        <li>
                            In-room minibar with water, sodas, beer, and snacks
                        </li>
                        <li>
                            Water taxi service and ground shuttles between
                            Harborside and Beachside
                        </li>
                        <li>Bike rentals</li>
                        <li>
                            Reusable stainless steel water bottle to refill
                            throughout your stay and to take home
                        </li>
                        <li>High-speed wireless guestroom internet</li>
                        <li>Porterage and Housekeeping gratuities</li>
                    </ul>
                </AccordionItem>

                <AccordionItem
                    header="In previous years, ground transportation was covered, why the change this year?"
                    id="ground-transportation-change"
                >
                    <p>
                        After reviewing guest feedback and analyzing the
                        operation, we decided to make this slight change. We
                        will continue to organize transportation and ensure that
                        once you land at any of the nearby airports in Florida,
                        you&apos;ll have VIP transportation ready to whisk you
                        to The Boca Raton and back to the airport for your
                        return trip.
                    </p>
                </AccordionItem>

                <AccordionItem
                    header="Can I extend my stay?"
                    id="can-i-extend-my-stay"
                >
                    <p>
                        Of course! We can help you work directly with the hotel,
                        and have secured a special rate for all of our guests
                        the three nights prior to and post event. (March 15, 16,
                        17, 20, 21, 22). Your room cost (excluding incidental
                        expenses) for the nights of the event (March 18 and
                        March 19, 2026) will be fully covered by the event.
                    </p>
                </AccordionItem>

                <AccordionItem
                    header="Can I bring a guest?"
                    id="can-i-bring-guest"
                >
                    <p>
                        Yes, we encourage you to bring a spouse / partner for
                        the 3 days. There will be a spouse / partner lunch and
                        all guests are invited to programming, activities, and
                        meals.
                    </p>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default FAQ
