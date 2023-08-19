const globals = {
  goHome: false,
  manHappy: false,
  fenceCompromised: false
}

const urbanDisk = () => ({
  //roomId: 'introduction',
  roomId: 'introduction',

  rooms: [
    /**
     *  ACT 0 - Introduction / Tutorial
     */
    {
      id: 'introduction',
      name: 'Introduction',
      desc: `The sun sets, filling the apartment with a full display of vibrant reds and oranges. As you sit in your apartment, you think over tonight's mission: explore the old abandoned nuclear power plant, and take a picture of the reactor. You need to find your car keys and camera before driving over there.\n\nNew to text adventures? Type HELP to see a list of commands. Type GO START to continue`,
      exits: [
        { dir: 'start', id: 'bathroom' },
      ]
    },

    /**
     *  ACT 1 - APARTMENT 
     */
    {
      id: 'bathroom',
      name: 'Bathroom',
      desc: `You stand in your apartment's only bathroom. The living room is to the NORTH.`,
      onLook: () => {
        if (getRoom('bathroom').smelly) {
          println("The bathroom stinks")
        }
      },
      items: [
        {
          name: 'toilet',
          desc: `The only toilet in your 2 bedroom apartment.`,
          onUse: () => {
            println(`You use the toilet and flush. The room is now smelly.`)
            currentRoom().smelly = true
          }
        },
        {
          name: 'lysol',
          desc: `A can of lysol spray. According to the label, it has a citrus meadow aroma. USE it to freshen up the air.`,
          isTakeable: true,
          onUse: () => {
            println(`You spray the air with lysol, filling it with a citrus meadow aroma.`)
            currentRoom().smelly = false
          }
        }
      ],
      exits: [
        { dir: 'north', id: 'living_room' },
      ],
    },
    {
      id: 'living_room',
      name: 'Living Room',
      desc: `The living room is sparsely furnished. WALTER sits on a couch across from the TV. A BOOKSHELF is up against a wall. To the SOUTH is the bathroom. To the NORTH is the kitchen. To the EAST is the garage.`,
      items: [
        {
          name: 'bookshelf',
          desc: 'A tall bookshelf, with many books and other objects.',
          onLook: () => unhideItem('camera', 'You find your CAMERA sitting on one of the shelves.'),
        },
        {
          name: 'camera',
          desc: 'A polaroid camera with enough film to last a while. Type USE CAMERA to take a picture.',
          isHidden: true,
          isTakeable: true,
          onUse: () => {
            if (disk.roomId === 'reactor') {
              println("You finally take a picture of the reactor! Your goal is met, good job urban explorer!")
              println("You hear a gunshot!")
              println("It must have come from a close room.")
              const utility = getRoom('utility_tunnel')
              utility.items = utility.hidden_items
              globals.goHome = true
              unblockExit('car', 'home')
            }
          }
        },
        {
          name: 'tv',
          desc: `The TV is in the middle of a news clip.\n"...a missing girl from Birmingham. She was last seen on Friday night, near the Saturn Bar in Avondale. She is twenty-one and is considered at risk. Now for the weather..."`
        }
      ],
      exits: [
        { dir: 'south', id: 'bathroom' },
        { dir: 'east', id: 'garage' },
        { dir: 'north', id: 'kitchen' },
      ],
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      desc: `There is a pile of dirty dishes in the SINK. You think you see a cockroach scurry into the CABINETS as the light turned on. The sound of your tv plays to the SOUTH.`,
      smelly: true,
      onLook: () => {
        if (currentRoom().smelly)
          println('Rotten food in the sink stinks in this room')
      },
      items: [
        {
          name: 'cabinets',
          desc: 'Typical kitchen cabinets.',
          onLook: () => unhideItem('keys', 'You find your car KEYS in the cabinets.')
        },
        {
          name: 'keys',
          desc: 'Keys to your car',
          isHidden: true,
          isTakeable: true
        },
        {
          name: 'sink',
          desc: 'The kitchen sink is full of dirty dishes. There is an odor from the rotting food.',
          onLook: () => {
            const knife = getItemInRoom('knife', 'kitchen')
            if (!currentRoom().smelly && knife && knife.isHidden)
              unhideItem('knife', 'You find a KNIFE at the bottom of the dirty dishes')
            else
              println("The sink smells so bad you don't want to reach into it.")
          }
        },
        {
          name: 'knife',
          desc: 'A sharp knife',
          isHidden: true,
          isTakeable: true
        }
      ],
      exits: [
        { dir: 'south', id: 'living_room' },
      ],
    },
    {
      id: 'garage',
      name: 'Garage',
      desc: `The sound of cars speeding by on the highway outside echoes through the parking garage. Your CAR is a few rows down on the right. Your apartment is to the WEST`,
      items: [
        {
          id: 'car',
          name: 'Car',
          desc: `Your beat up old car.`,
          onUse: () => {
            println(`You get into your old, beat up car, put the keys in the ignition, and drive out of the parking garage. You merge onto the highway, the cars speeding into the sunset.\n\nAs you drive into the countryside towards the abandoned nuclear power plant, you remember back to your other adventures. The hot steam ducts below the city, the old insane asylum with the beds with straps. Your heart races at the thought of a new adventure.\n\n...\n\nYou arrive at the plant, the sun has gone down and it is night time. You pull over on the outskirts, hiding the car amongst the trees.`)
            enterRoom('car')
          }
        }
      ],
      exits: [
        { dir: 'west', id: 'living_room' },
      ],
    },


    /**
     *  ACT 2 - Outside Power Plant
     */
    {
      id: 'car',
      name: 'Your Car',
      desc: `You stand outside your CAR in a forested area near the nuclear power plant. The power plant's fence is to the EAST.`,
      onLook: () => {
        if (globals.goHome) {
          println("Type GO HOME to get in the car and leave!")
        }
      },
      items: [
        {
          id: 'car',
          name: 'Car',
          desc: `Your beat up old car.`,
          onLook: () => {
            const money = getItemInRoom('money', 'car')
            if (money) {
              println(`There is some MONEY in the car, just spare change.`)
              money.isTakeable = true
              money.isHidden = false
            }
            const flashlight = getItemInRoom('flashlight', 'car')
            if (flashlight) {
              println(`There is a FLASHLIGHT in the car.`)
              flashlight.isTakeable = true
              flashlight.isHidden = false
            }
          }
        },
        {
          id: 'money',
          name: 'Money',
          desc: `Some spare change. One dollar and fifty cents.`,
          isTakeable: false,
          isHidden: true,
          onUse: () => {
            if (disk.roomId === 'homeless_camp') {
              removeItem('money')
              println(`You hand the homeless man your spare change. "Thank you, kind one," he says. A smile creeps across his face.`)
              globals.manHappy = true
              const blanket = getItemInRoom('blanket', 'homeless_camp')
              if (blanket) {
                println(`The homeless MAN motions towards his BLANKET`)
                blanket.isTakeable = true
              }
            } else {
              println(`You cannot use that here.`)
            }
          }
        },
        {
          id: 'flashlight',
          name: 'Flashlight',
          desc: `A small flashlight, should come in handy in dark places.`,
          isTakeable: false,
          isHidden: true,
          onUse: () => {
            if (disk.roomId === 'dark_woods') {
              println(`You illuminate the dark woods with your flashlight. You see a CAR hidden in the brush.`)
              getItemInRoom('car', 'dark_woods').isHidden = false
            } else {
              println(`You illuminate the darkness.`)
            }
          }
        },
      ],
      exits: [
        { dir: 'north', id: 'forest' },
        { dir: 'east', id: 'outside_fence' },
        { dir: 'south', id: 'forest' },
        { dir: 'west', id: 'forest' },
        { dir: 'home', id: 'finale', block: `You can't go home now, you still need that picture of the reactor!` },
      ]
    },
    {
      id: 'outside_fence',
      name: 'Outside the Fence',
      desc: `You stand outside the barbed wire fence of the abandoned nuclear power plant. You can see the cooling tower against the night sky.`,
      onLook: () => {
        if (globals.fenceCompromised) {
          println("The barbed wire fence is compromised, you can travel through it by typing GO EAST")
        }
      },
      exits: [
        { dir: 'north', id: 'homeless_camp' },
        { dir: 'east', id: 'parking_lot', block: `You cannot scale or go through the barbed wire fence` },
        { dir: 'south', id: 'dark_woods' },
        { dir: 'west', id: 'car' }
      ],
    },
    {
      id: 'dark_woods',
      name: 'Dark Woods',
      desc: `The woods are very dark here, and it is hard to see as you make your way through the brambles.`,
      items: [
        {
          id: 'unknown_car',
          name: 'Car',
          desc: `A mysterious car hidden in the brush, I wonder whose this is.`,
          isBroken: false,
          isHidden: true,
          onLook: () => {
            const car = getItemInRoom('car', 'dark_woods')
            if (car.isBroken) {
              println(`The car window is broken.`)
              const boltcutters = getItemInRoom('boltcutters', 'dark_woods')
              if (boltcutters) {
                println('There are a pair of BOLTCUTTERS in the car.')
                boltcutters.isTakeable = true
                boltcutters.isHidden = false
              }
            } else {
              println(`Maybe I can break a window with a heavy object.`)
              const boltcutters = getItemInRoom('boltcutters', 'dark_woods')
              if (boltcutters && boltcutters.isHidden) {
                println(`You can see a pair of BOLTCUTTERS through the glass.`)
              }
            }
          }
        },
        {
          id: 'boltcutters',
          name: 'Boltcutters',
          desc: `A pair of bultcutters, could come in handy cutting metal.`,
          isHidden: true,
          isTakeable: false,
          onUse: () => {
            if (disk.roomId === 'outside_fence') {
              println("You use the boltcutters to cut a hole in the fence, link by link.\n\nYou now have a big enough hole in the fence that you can squeeze through to the other side.\n\nGO EAST to pass through.")
              unblockExit('outside_fence', 'east')
              globals.fenceCompromised = true
            }
            if (disk.roomId === 'river') {
              println("You cut the padlock with the boltcutters, remove the chain and open the grate.\n\nGO EAST to pass through the grate and into the tunnel.")
              unblockExit('river', 'east')
            }
          },
        },
      ],
      exits: [
        { dir: 'north', id: 'outside_fence' },
        { dir: 'east', id: 'dark_woods' },
        { dir: 'south', id: 'forest' },
        { dir: 'west', id: 'dark_woods' },
      ],
    },
    {
      id: 'homeless_camp',
      name: 'Homeless Camp',
      desc: `A makeshift tent is made using shipping palettes and tarps.\n\nClothes are hanging up on a line.\n\nThere is a homeless MAN looking at you from the opposite side of a small fire.`,
      items: [
        {
          id: 'fire',
          name: 'Fire',
          isLarge: false,
          onLook: () => {
            if (getItemInRoom('fire', 'homeless_camp').isLarge) {
              println(`The fire is roaring. The homeless man looks content beside it.`)
            } else {
              println(`The fire is small. The homeless man looks cold.`)
            }
          }
        },
        {
          id: 'blanket',
          name: 'Blanket',
          desc: 'A smelly old blanket, but it will keep you warm.',
          onLook: () => {
            const blanket = getItemInRoom('blanket', 'homeless_camp')
            if (blanket) {
              if (blanket.isTakeable) {
                println("The MAN nods at you to TAKE it with you.")
              } else {
                println("It is wrapped around the MAN's body to keep him warm.\n\nHe doesn't want to part with it.")
              }
            } else {
            }
          },
          onUse: () => {
            if (disk.roomId === 'outside_fence') {
              println("You throw the blanket over the barbed wire fence. Perfect, you can now climb over. Type GO EAST to climb over the fence.")
              globals.fenceCompromised = true
              removeItem('blanket')
              const room = getRoom('outside_fence')
              const exit = getExit('east', room.exits)
              delete exit.block;
            } else {
              println("You wrap the blanket around youself, it is warm.")
            }
          },
          isTakeable: false
        },
      ],
      exits: [
        { dir: 'south', id: 'outside_fence' },
        { dir: 'north', id: 'forest' },
        { dir: 'east', id: 'forest' },
        { dir: 'west', id: 'forest' }
      ],
    },
    {
      id: 'forest',
      name: 'The Forest',
      desc: `The trees surround you, but at least there is moonlight here.\n\nYou are lost in the forest.\n\nMaybe you can find your way back?`,
      items: [
        {
          id: 'wood',
          name: 'Wood',
          desc: `Some flimsy sticks and sturdier branches.`,
          isTakeable: true,
          onUse: () => {
            if (disk.roomId === 'dark_woods') {
              const car = getItemInRoom('car', 'dark_woods')
              if (car.isHidden) {
                println("You cannot do that here.")
              } else {
                if (car && !car.isBroken) {
                  println(`You break the car's window with a thick branch`)
                  car.isBroken = true
                } else {
                  println(`You've already broken the window.`)
                }
              }
            } else {
              println("You cannot do that here.")
            }
          }
        },
      ],
      exits: [
        { dir: 'north', id: 'dark_woods' },
        { dir: 'east', id: 'forest' },
        { dir: 'south', id: 'homeless_camp' },
        { dir: 'west', id: 'forest' },
      ]
    },


    /**
     * ACT 3 - Inside power plant
     */
    {
      id: 'containment',
      name: 'Containment Structure',
      desc: `The containment structure is a large, cylindrical, concrete room with a domed ceiling. There are many pipes and sensors running along the walls.\n\nThere are stairs that go DOWN towards a bluish glow, and a door that leads back to the outside to the WEST.\n\nTo the SOUTH is the utility tunnel.`,
      exits: [
        { dir: 'west', id: 'parking_lot', block: `The door is locked with a deadbolt. I would need to USE a KEY to open it.` },
        { dir: 'south', id: 'utility_tunnel' },
        { dir: 'down', id: 'reactor' },
      ],
    },
    {
      id: 'intake_structure',
      name: 'Intake Structure',
      desc: `You are in the water intake structure of the nuclear power plant. Pipes and sensors stretch across the floor in all directions, feeding water to the different parts of the nuclear power plant. You hear gurgling sounds as the water is still being pumped in to cool the decomissioned reactor.\n\nTo the NORTH is a utility tunnel.\n\nTo the SOUTH is the river.`,
      exits: [
        { dir: 'north', id: 'utility_tunnel' },
        { dir: 'west', id: 'river' }
      ],
    },
    {
      id: 'security_office',
      name: 'Security Office',
      desc: `Security TVs and alarm systems sit on tables.\n\nAs you walked in you thought you saw some movement on one of the TVs, but whatever it was is now gone.\n\nThere is no one here.`,
      exits: [
        { dir: 'east', id: 'utility_tunnel' },
        { dir: 'south', id: 'parking_lot' }
      ],
    },
    {
      id: 'reactor',
      name: 'Reactor Core',
      desc: `As you walked down the stairs you felt like you were entering a portal to another world.\n\nThe blue light shines up from the reactor core pool.\n\nThis is it, what you came here for...now it's time to take that picture.`,
      exits: [
        { dir: 'up', id: 'containment' },
      ],
    },
    {
      id: 'utility_tunnel',
      name: 'Utility Tunnel',
      desc: `The tunnel is wide enough to drive a golf cart through.\n\nWires and pipes line the concrete walls.`,
      hidden_items: [
        {
          id: 'body',
          name: "Body",
          desc: "A BODY lays on the ground, surrounded by a pool of blood.",
          onLook: () => {
            println("It appears to be a security guard. A gunshot wound to the back.")
            unhideItem('key', "The guard has a KEY on him.")
            println("Hurry back to the car and GO HOME before the murderer finds you!")
          }
        },
        {
          id: 'key',
          name: 'Key',
          desc: "A shiny key, looks like it goes to the doors around here.",
          isTakeable: true,
          isHidden: true,
          onUse: () => {
            println("You cannot use it here")
          }
        }
      ],
      exits: [
        { dir: 'north', id: 'containment' },
        { dir: 'south', id: 'intake_structure' },
        { dir: 'east', id: 'security_office' },
      ],
    },
    {
      id: 'parking_lot',
      name: 'Parking Lot',
      desc: `Looks like the nuclear power plant's main parking lot. There are a few broken down cars here, their owners long gone. The night is clear with a full moon, and you can see many more stars out here than you could back in town.\n\nIt makes you feel...isolated.`,
      exits: [
        { dir: 'west', id: 'outside_fence' },
        { dir: 'east', id: 'containment', block: `The door is locked with a deadbolt, I would need to USE a KEY to get in.` },
        { dir: 'south', id: 'river' },
        { dir: 'north', id: 'security_office', block: `The door is locked with a deadbolt, I would need to USE a KEY to get in.` },
      ],
    },
    {
      id: 'river',
      name: 'River',
      desc: `You stand on the banks of a wide river. The trees reach out over the riverbank, like they are trying to escape the power plant. You touch the water and it is unusually warm. A utility tunnel leads EAST towards the intake structure.`,
      exits: [
        { dir: 'north', id: 'parking_lot' },
        { dir: 'east', id: 'intake_structure', block: `The tunnel is locked with a chain and padlock.` }
      ],
    },


    /**
     * Finale
     */
    {
      id: 'finale',
      name: 'Going Home',
      onLook: () => {
        println(`You race away from the nuclear power plant, what happened still processing in your head.\n\nWho shot the man? Where did he go?\n\nCongratulations, game over!\n`)
        println(`--- CREDITS ---`)
        println(`Fredric Dorothy (redmountainman1) - Story, coding and artwork`)
        println(`JimJam - Music and sound effects\n\n`)
        println(`Made for Vulcan Jam 5. Thank you again for playing.`)
      }
    }
  ],


  /**
   *  CHARACTERS
   */
  characters: [
    {
      name: ['walter', 'roommate'],
      roomId: 'living_room',
      desc: 'Walter looks zoned out watching the TV.',
      onTalk: () => println("Hey, weren't you going to scope out that abandoned nuclear power plant?"),
      topics: [
        {
          option: "What's on **TV**?",
          removeOnRead: true,
          line: `"Just the news. Something about a missing child in the area."`
        },
        {
          option: "Where's my **CAMERA**?",
          removeOnRead: true,
          line: `"Look around, it's in the living room somewhere."`
        },
        {
          option: "Where are my **KEYS**?",
          removeOnRead: true,
          line: `"Don't you usually put them in the kitchen cabinets?"`
        }
      ]
    },
    {
      name: ['homeless man', 'man', 'homeless', 'sam'],
      roomId: 'homeless_camp',
      desc: 'The homeless man sits on the other side of the fire.',
      onTalk: () => {
        if (globals.manHappy) {
          println("Hello, my name is SAM. You aren't the first one through here recently. What can I help you with?")
        } else {
          println(`The homeless man remains silent, with a frown on his face. Finally, he says "Got any spare change?"`)
        }
      },
      topics: []
    },
  ],
});

currentRoom = () => getRoom(disk.roomId)

const unblockExit = (roomId, exitId) => {
  const room = getRoom(roomId)
  const exit = getExit(exitId, room.exits)
  delete exit.block;
}

const unhideItem = (itemId, desc) => {
  const item = getItemInRoom(itemId, disk.roomId)
  if (item && item.isHidden) {
    println(desc)
    item.isHidden = false
  }
}
