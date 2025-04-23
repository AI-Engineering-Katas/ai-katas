# AI Engineering Workshop for Software Engineers

SEP's clients have and will continue to request AI solutions to business problems that our engineers traditionally solve with deterministic algorithms.
Demand for data-driven solutions increases. SEP's capacity to deliver context-aware applications has not kept pace.
Further, SEP engineers are really smart and judge the time required to learn, vet, and master a new tool to be greater than the time spent accomplishing the task with the tools they know.
You need SEP engineers to engage with business problems that cannot be solved effectively with the tools they have, so that the value proposition for learning new tools becomes clear.

After participating in this workshop, 20 SEP engineers will be able to map business problems to AI capabilities, design AI-powered solutions using their existing software expertise, and confidently select appropriate AI solutions for implementation.
SEPeers will possess a structured process for decomposing complex data challenges into simple components that can be developed as AI services.
Through hands-on experience during the workshop, they will discover that their existing software design expertise readily translates to architecting AI-enabled solutions.
The workshop will equip them with access to a curated collection of commercially licensed models - including LLMs, embedding models, and time series classifiers - that can be easily containerized and deployed using their existing DevOps chops.
Additionally, they will have ongoing access to a continually improving resource that bridges the gap between user requirements and industry terminology, enabling them to confidently navigate and communicate within the AI solution space.

The AI Solutions Workshop is a hands-on, collaborative experience designed to bridge the gap between traditional software engineering and AI-powered solutions. The workshop begins with a 30-minute foundational session where attendees are introduced to two essential tools: the AI Building Blocks site, which catalogs AI capabilities and their corresponding solution fields, and user journey mapping, demonstrated through video instruction and a practical walkthrough of a reference implementation.
Following this introduction, the 20 participants divide into five groups of four and receive carefully crafted business problem "katas" that specifically highlight scenarios where traditional algorithmic approaches fall short. For the next two hours, each group engages in a structured design process: they first map their users' current journey, identify opportunities for AI enhancement, and then design a new journey supported by AI capabilities. Throughout this exercise, groups have access to Lee and a co-facilitator who provide guidance on mapping business problems to specific AI capabilities and selecting appropriate solutions from the Building Blocks site.
The workshop culminates in a 60-minute review session where each group presents their solution to their peers. This presentation format serves multiple purposes: it allows engineers to see how their existing software consulting skills translate to AI consulting, exposes them to various practical applications of AI services, and builds confidence in discussing AI solutions using industry-standard terminology. The interactive feedback session also allows participants to discuss the tradeoffs of their approaches, and challenge each other to devise different solutions.

I have run this workshop seven times over Zoom and twice in person - once at SEP and once at a software conference. At every session, participants were excited to share their solutions with each other. They stuck around after the event to debate approaches with folks they hadn't met, and they took photos of systems that other groups designed. Participants always enjoy the hands-on nature of the workshop, and at the in-person sessions, software engineers have told me that they are going to back to their company to implement the solution they designed.

## Format

- 4 hours
- 20 participants
- whiteboards in The Studio

#### Who

- Open invitation for makers and designers
- We will send direct invitations to SSEs and SE2s
  - why? SSEs and SE2s are the demographic most likely engage with new tools and spread new ideas to their project teams
- Andrew Dunlap, Rob Herbig, and Jordan Thayer have already participated this workshop two or more times. One of them will join me as co-facilitator

## When it should happen

Late March or early April. Not on March 27th or during Falco's training April 28-May 9

I imagine the folks who opt-in for Falco's workshop will also opt-in for the this workshop. We should hold the workshops at least two weeks apart to reduce friction.

## Workshop Support

- eight tables in The Studio
- lunch and snacks/drinks

## Post workshop opportunities

1. I host a brown bag that recaps the experience for SEPeers who did not attend. A couple volunteering attendees will describe their AI solutions, so that non-attendees can see their peers' new expertise
2. I take the same cohort a level deeper with a workshop where they implement the AI solutions that they designed
3. I run the AI Engineering System Design workshop again the following month for a new cohort

# Copy for Workshop Attendees

### Description

There you are, sipping an Old Fashioned and refactoring your codebase, when a wild-eyed product owner knocks on your door and begs your help to implement a RAG app demanded by The Board. When they call, will you be ready to design a solution with GenAI?

We weren't. We tuned into podcasts, watched YouTube videos, ran tutorials, tracked https://aigrant.org/ recipients, read research papers, joined discord servers, debated pipedreams with strangers, and built toy projects until we felt qualified to write GenAI services.

All of that theory and technical practice gave us the coveted "how", but not the "where", "why", or "when" of applying GenAI. To get that good good intuition, we had to write domain-specific business problems and then design solutions that leverage GenAI. The practice worked! It brought confidence to sales calls in domains that we have never worked in and, unexpectedly, made us better at collaborating with each other.

Join us for an interactive solution-design session! We took GenAI use-cases that we built ourselves or saw in the real-world and adapted them into a set of katas.

We'll work in three stages:

1. Preparation: Form a team and pick a kata
2. Design Phase: Collaborate a solution with your team
3. Peer Review Phase: Discuss the tradeoffs of your approach with the group at large

### Pre-requisites

Want to get the most out of our workshop? While optional, exploring these resources beforehand will spark your creativity and improve your experience:

1. Skim the reference material we will use during the workshop at https://ai-engineering-katas.github.io/ai-katas/
2. Deep-dive into any Capability that interests you, explore its Solutions, and check out the related Tools
3. Feel free to chat with AI assistants like ChatGPT or Claude to connect these concepts with your own ideas

Join us ready to learn, whether you've done the prep or not – we'll explore together!

# Detailed Agenda

## Workshop Prep (30 minutes)

1. [AI Building Blocks Intro](https://ai-engineering-katas.github.io/ai-katas/intro/)
1. [System Design Intro Slides](https://docs.google.com/presentation/d/1aH82_94E6qhRl9e67xlFHqf1W0bseggdXY-kZhEw3u8/edit#slide=id.p)
1. [Journey Map video](https://www.youtube.com/watch?v=2W13ext26kQ)
   - Actions that a user must take to complete their goal
   - Touchpoints where the user interacts with the system
1. Sample Walk Through of the [AI Building Blocks site](https://ai-engineering-katas.github.io/ai-katas/)

## Groups and Katas (15 minutes)

1. Split into groups
2. Explain rules
3. Assign katas

#### Exercise (120minutes + two 10minute breaks)

1. Read Kata
2. Write Journey Map of current user process
3. Keeping Capabilities Slideshow in mind, pick a spot on the journey map to improve
4. Write a new journey map for your target
5. Design a system that supports the new journey map
6. Revise your design
7. Prepare a presentation

#### Review (60 minutes)

1. Present solutions
2. Questions, feedback, and emoji responding
3. Announce emoji
