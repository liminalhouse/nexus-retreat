'use client'

import AccordionItem from '../Accordion/StyledAccordionItem'
import Accordion from '../Accordion/StyledAccordion'
import styles from './faq.module.scss'

const FAQ = () => {
    return (
        <div className={styles.wrapper}>
            <Accordion>
                <h1 style={{ marginBottom: '1rem' }}>
                    Learn more about the retreat
                </h1>
                <br />
                <AccordionItem
                    header="Why is the retreat moving this year?"
                    id="why-move-retreat"
                    itemKey={0}
                >
                    <p>
                        Our goal is to keep the executive retreat fresh and fun
                        each year. The Boca Raton Beach Club resort is a
                        beachside paradise with myriad opportunities for
                        relaxation, rejuvenation, exercise, sport, and
                        adventure.
                    </p>
                    <p>
                        After four wonderful years at The Sanctuary in Kiawah,
                        we&apos;re moving our retreat to The Boca Raton for our
                        fifth year. This change offers enhanced guest
                        experiences and more opportunities to enjoy Florida,
                        aiming to attract even more attendees.
                    </p>
                </AccordionItem>
                <AccordionItem
                    header="Are there any substantive changes guests can expect?"
                    id="substantive-changes"
                    itemKey={1}
                >
                    <p>
                        You can expect the same type of executive retreat as in
                        previous years including VIP guests, engaging
                        conversations, high-touch networking, group activities,
                        fabulous dinners, and, as always, plenty of fun.
                    </p>
                </AccordionItem>
                <AccordionItem
                    header="Will there be changes to the structure?"
                    id="changes-to-structure"
                    itemKey={2}
                >
                    <p>
                        Attendees can anticipate the same VIP treatment and
                        quality content as in previous years. We aim for this to
                        be a distinguished experience featuring excellent
                        programming, exceptional dinners, a variety of
                        activities, valuable networking opportunities, and some
                        unexpected elements.
                    </p>
                </AccordionItem>
                <AccordionItem
                    header="Will there still be activities like we had in years past?"
                    id="activities"
                >
                    <p>
                        Guests will have the opportunity to enjoy multiple
                        pools, golf, tennis, pickleball, workouts, water sports,
                        and luxurious spa facilities. Our team is happy to help
                        facilitate activities, which we will share in more
                        detail closer to the event.
                    </p>
                </AccordionItem>
                <AccordionItem
                    header="What do I need to know in terms of travel?"
                    id="travel-info"
                    itemKey={3}
                >
                    <p>
                        The Boca Raton, conveniently situated between Palm Beach
                        and Miami, offers excellent accessibility through three
                        international airports (FLL, PBI, and MIA), as well as
                        Boca Raton Airport.
                    </p>
                    <p>
                        Upon arrival, you will have ground transportation
                        arranged on your behalf (at guest’s expense).
                    </p>
                    <br />
                    <strong>Airport transport times:</strong>
                    <ul>
                        <li>FLL (24 miles / 30-35 min)</li>
                        <li>
                            PBI (28 miles / 35-40 min, also a private jet hub)
                        </li>
                        <li> MIA (45 miles / 60 min) </li>
                        <li>Boca Raton Executive (5 miles/12 min)</li>
                    </ul>
                </AccordionItem>

                <AccordionItem
                    header="In previous years, ground transportation was covered, why the change this year?"
                    id="ground-transportation-change"
                    itemKey={4}
                >
                    <p>
                        As always, it&apos;s our goal to enhance the experience
                        for guests. We have secured a discounted rate with the
                        pre-eminent local car service, and our team will work
                        closely with yours to ensure transportation is seamless.
                    </p>
                </AccordionItem>

                <AccordionItem
                    header="Will event lodging and meals will be covered by the event?"
                    id="event-lodging-meals"
                    itemKey={4}
                >
                    <p>
                        Yes, all hotel costs (excluding incidentals), meals, and
                        activities will be covered by the event. Ground
                        transportation and non-event activities (e.g. spa
                        services, room service) will be arranged for you at your
                        own cost. Access to the amenities and activity
                        programming of The Boca Raton Club are also included.{' '}
                        <a
                            href="https://www.thebocaraton.com/experiences/programming/#!/?categoryIds=3730c564-444d-47ff-9ab2-2037b8cbc1df,debe2ada-6e40-4d83-876f-52ac24f20670,334e5c90-4d6c-45b0-95f8-a5166102f128,b96993fd-16d5-4f6d-9940-c13c7d8c6273"
                            target="_blank"
                        >
                            Boca Raton Programming & Events
                        </a>
                        can be found here.
                    </p>
                    <br />
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
                    header="Can I come early / stay longer?"
                    id="can-i-come-early-stay-longer"
                    itemKey={5}
                >
                    <p>
                        Of course! We can help you work directly with the hotel,
                        and have secured a special rate for all of our guests
                        the three nights prior to and post event. (March 15, 16,
                        17, 20, 21, 22). Your room cost (excluding incidental
                        expenses) for the nights of the event - March 18 and
                        March 19, 2026 will be fully covered by the event.
                    </p>
                </AccordionItem>

                <AccordionItem
                    header="Can I bring a guest?"
                    id="can-i-bring-guest"
                    itemKey={6}
                >
                    <p>
                        Yes, we encourage you to bring a spouse / partner for
                        the 3 days. There will be a spouse / partner lunch and
                        all guests are invited to content, activities, and
                        meals.
                    </p>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default FAQ
