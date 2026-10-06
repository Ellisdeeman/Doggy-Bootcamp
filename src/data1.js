/* ===================== PROGRAM CONTENT ===================== */
const SKILLS = [
  {id:"marker", name:"Marker Word / Clicker", emoji:"🔔", cat:"Foundations", cue:"“Yes!” or click",
   summary:"A unique sound that tells {dog} “that exact thing you just did earns a reward.”",
   why:"A marker lets you pinpoint the precise moment {dog} gets it right, which makes learning faster and clearer than praise alone."},
  {id:"name", name:"Name Recognition", emoji:"📛", cat:"Foundations", cue:"{dog}’s name",
   summary:"Hearing their name means “look at me — good things happen.”",
   why:"A fast, happy head-turn to their name is the starting point for every other cue and for calling {dog} away from trouble."},
  {id:"focus", name:"Eye Contact & Focus", emoji:"👀", cat:"Foundations", cue:"“Look” (and voluntary check-ins)",
   summary:"Offering and holding soft eye contact, and checking in with you on their own.",
   why:"Attention is the gateway skill: a dog who checks in with you is ready to listen and easier to guide around distractions."},
  {id:"touch", name:"Hand Target (Touch)", emoji:"✋", cat:"Foundations", cue:"“Touch”",
   summary:"Bumping their nose into your open palm on cue.",
   why:"Touch is an easy, upbeat way to move {dog} anywhere — off the couch, past a distraction, or back to you — without pulling or pushing."},
  {id:"sit", name:"Sit", emoji:"🪑", cat:"Foundations", cue:"“Sit” + raised palm",
   summary:"Rear on the floor until released.",
   why:"Sit is a simple, polite default — a way to ‘say please’ for meals, doors, and greetings."},
  {id:"down", name:"Down", emoji:"⬇️", cat:"Foundations", cue:"“Down” + flat palm toward floor",
   summary:"Lying down with elbows on the floor until released.",
   why:"Down is a calmer, more stable position — the base for settling, longer stays, and relaxing in public."},
  {id:"recall", name:"Come (Recall)", emoji:"🏃", cat:"Life Skills", cue:"“{dog}, come!” (or “Here!”)",
   summary:"Running straight back to you, every time, when called.",
   why:"A reliable recall is one of the most important safety skills a dog can have — and it gives {dog} more freedom."},
  {id:"leaveit", name:"Leave It", emoji:"🚫", cat:"Impulse Control", cue:"“Leave it”",
   summary:"Turning away from something they want, and getting rewarded for it.",
   why:"Leave it protects {dog} from dropped medication, trash, and other hazards, and builds self-control."},
  {id:"dropit", name:"Drop It", emoji:"🦴", cat:"Impulse Control", cue:"“Drop”",
   summary:"Happily letting go of whatever is in their mouth.",
   why:"Drop it keeps {dog} safe when they pick up something dangerous and keeps games of tug fun and fair — without chasing or prying."},
  {id:"lll", name:"Loose-Leash Walking", emoji:"🦮", cat:"Life Skills", cue:"“Let’s go” / “This way!”",
   summary:"Walking near you with a relaxed, J-shaped leash.",
   why:"Pulling is uncomfortable and stressful for both ends of the leash. Loose-leash walks are safer, calmer, and more fun."},
  {id:"stay", name:"Stay (3 Ds)", emoji:"🧘", cat:"Impulse Control", cue:"“Stay” + flat palm, released with “Free!”",
   summary:"Holding a position until released, built through Duration, Distance and Distraction.",
   why:"Stay keeps {dog} safe and in place — while you open the door, unload groceries, or a guest comes in."},
  {id:"place", name:"Place / Mat", emoji:"🛏️", cat:"Calm & Comfort", cue:"“Place”",
   summary:"Going to a mat or bed and lying down there until released.",
   why:"Place gives {dog} a clear job when life gets busy — doorbells, dinner time, guests — instead of jumping or begging."},
  {id:"wait", name:"Wait at Doors", emoji:"🚪", cat:"Impulse Control", cue:"“Wait”",
   summary:"Pausing at doors, gates and thresholds until invited through.",
   why:"Waiting at doors prevents door-dashing, one of the most common ways dogs get lost or hurt."},
  {id:"settle", name:"Settle / Calm", emoji:"😌", cat:"Calm & Comfort", cue:"“Settle”",
   summary:"Relaxing and switching off — at home and out in the world.",
   why:"Calm is a skill that can be practiced. Dogs who can settle cope better with busy homes, vet visits, cafés and travel."},
  {id:"greet", name:"Polite Greetings", emoji:"👋", cat:"Life Skills", cue:"Four paws on the floor (or “Sit”) to say hi",
   summary:"Greeting people with all four paws on the floor instead of jumping.",
   why:"Jumping is natural — dogs want to say hi up close — but it can knock over kids and older adults. We teach a better way to get attention."},
  {id:"crate", name:"Crate & Alone-Time Comfort", emoji:"🏠", cat:"Calm & Comfort", cue:"“Bedtime” / “Crate”",
   summary:"Feeling safe and relaxed in a crate or safe area, and being home alone.",
   why:"Being comfortable alone and in a crate makes vet stays, travel, and everyday life far less stressful for {dog}."},
  {id:"spin", name:"Spin", emoji:"🌀", cat:"Tricks", cue:"“Spin” + circling finger",
   summary:"Turning a full circle on cue.",
   why:"Tricks are a fun, low-pressure way to build your communication — and a great confidence booster."},
  {id:"paw", name:"Shake / Paw", emoji:"🐾", cat:"Tricks", cue:"“Paw” or “Shake”",
   summary:"Placing a paw in your open hand.",
   why:"A classic crowd-pleaser that also helps {dog} get comfortable having their paws handled (useful for nail trims!)."},
  {id:"rollover", name:"Roll Over", emoji:"🔄", cat:"Tricks", cue:"“Roll over” + rolling hand motion",
   summary:"Rolling all the way over from a down.",
   why:"A multi-step trick that teaches you to break a behavior into small pieces — and it’s just plain fun."}
];

const PHASES = [
  {week:1, name:"Foundations", tag:"Focus & communication", color:"#E07A5F"},
  {week:2, name:"Everyday Life Skills", tag:"Recall, leash & self-control", color:"#E59A4B"},
  {week:3, name:"Building Self-Control", tag:"Doors, mats & greetings", color:"#6FA58A"},
  {week:4, name:"Proofing the 3 Ds", tag:"Duration, distance, distraction", color:"#4F8A7A"},
  {week:5, name:"Combining Skills", tag:"Real distractions & tricks", color:"#6C7AA6"},
  {week:6, name:"Real-World Ready", tag:"Field trips & graduation", color:"#9C6EA3"}
];

const AGE_NOTES = {
  puppy:"🐶 Puppy tip: keep sessions to 1–3 minutes, train after a nap (not when overtired), and always end on a success. Use soft surfaces, skip repetitive jumping, and make new experiences safe and positive — socialization is time-sensitive.",
  adolescent:"🧑‍🎤 Adolescent tip: dogs between about 6 and 18 months often seem to ‘forget’ skills — that’s normal brain development, not defiance. Lower your criteria in new places, use your best treats, and meet {dog}’s exercise and sniffing needs before you train.",
  adult:"🐕 Adult tip: adult dogs learn new skills just as well as puppies. If a cue word has a bad history (like a “Come!” that’s been yelled), simply pick a fresh word.",
  senior:"🦳 Senior tip: keep sessions short and low-impact, train on soft, non-slip surfaces, and skip or modify roll over and anything with jumping. Ask your vet about pain — discomfort can look like ‘stubbornness’. Use small, soft treats and watch daily calories."
};

const BASICS = [
  ["Use tiny, tasty treats","Pea-sized, soft, smelly treats (chicken, cheese, commercial training treats) keep sessions moving. Use part of {dog}’s daily food allowance to avoid weight gain."],
  ["Mark, then treat","Say your marker (“Yes!”) at the exact moment {dog} does the right thing, then deliver the treat within a second or two."],
  ["Short and sweet","Several 3–5 minute sessions beat one long one. Stop while {dog} is still keen."],
  ["Say cues once","Repeating a cue teaches {dog} to wait for the third ask. If they don’t respond, make it easier rather than louder."],
  ["Make it easier, not harder","If {dog} struggles twice in a row, lower your criteria — less distance, less time, a quieter room."],
  ["Change one thing at a time","When you add distance, keep duration and distraction easy (and vice versa)."],
  ["No punishment","Skip leash pops, yelling, spray bottles, ‘alpha rolls’ and shock/prong collars. Reward what you want, manage what you don’t."],
  ["Watch for stress","Yawning, lip-licking, turning away, whale eye, or refusing food mean {dog} is uncomfortable. Take a break or make things easier."],
  ["Get help when needed","For growling, guarding, lunging, or panic when alone, consult a certified force-free trainer (e.g. CPDT-KA, KPA-CTP) or a veterinary behaviorist."]
];

const T = "Tiny soft treats (pea-sized)", POUCH="Treat pouch or pocket", CLICK="Clicker (optional)", LEASH="4–6 ft flat leash", HARN="Well-fitted harness", MAT="Mat, towel or dog bed", QUIET="Quiet room";
const DAYS = [];
