const urbanDisk = () => ({
  //roomId: 'introduction',
  roomId: 'car',

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
      desc: `You stand in your apartments only bathroom. There's a TOILET in here, as well as a can of LYSOL. There's a door to the NORTH.`,
      music: '',
      onLook: () => {
        if (getRoom('bathroom').smelly) {
          println("The bathroom stinks")
        }
      },
      items: [
        {
          name: 'door',
          desc: 'It leads NORTH.',
          onUse: () => println(`Type GO NORTH to try the door.`),
        },
        {
          name: 'toilet',
          desc: `The only TOILET in your 2 bedroom apartment.`,
          onUse: () => {
            println(`You use the toilet and flush. The room is now smelly.`)
            getRoom(disk.roomId).smelly = true
          }
        },
        {
          name: 'lysol',
          desc: `A can of lysol spray. According to the label, it has a citrus meadow aroma. USE it to freshen up the air.`,
          isTakeable: true,
          onUse: () => {
            println(`You spray the air with lysol, filling it with a citrus meadow aroma.`)
            getRoom(disk.roomId).smelly = false
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
      music: '',
      onLook: () => {
        const item = getItemInRoom('camera', disk.roomId)
        if (item && !item.isHidden) {
          println('Your CAMERA sits on the bookshelf')
        }
      },
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
          isTakeable: true
        },
        {
          name: 'tv',
          desc: `The TV is in the middle of a news clip.\n"...a missing girl from Birmingham. She was last seen on Friday night, near the bar Saturn in Avondale. She is eleven and is considered at risk. Now for the weather..."`
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
        const item = getItemInRoom('keys', disk.roomId)
        if (item && !item.isHidden) {
          println('Your KEYS are on the countertop.')
        }
        if (getRoom(disk.roomId).smelly)
          println('Rotten food in the sink stinks in this room')
      },
      music: '',
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
            if (!getRoom(disk.roomId).smelly)
              unhideItem('knife', 'You find a KNIFE at the bottom of the dirty dishes')
            else
              println("The sink smells so bad you don't want to reach into it")
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
      music: '',
      items: [
        {
          id: 'car',
          name: 'Car',
          desc: `Your beat up old car.`,
          onUse: () => {
            println('You drive to the abandoned nuclear power plant...\n\n')
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
          desc: `Some spare change, one dollar and fifty cents.`,
          isTakeable: false,
          isHidden: true,
          onUse: () => {
            if (disk.roomId === 'homeless_camp') {
              removeItem('money')
              println(`You hand the homeless man your spare change. "Thank you, kind one," he says. A smile creeps across his face.`)
              getRoom('homeless_camp').isHappy = true
              const blanket = getItemInRoom('blanket', 'homeless_camp')
              if (blanket) {
                println(`The MAN motions towards the BLANKET`)
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
          desc: `A small flashlight, should come in handy.`,
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
      ]
    },
    {
      id: 'outside_fence',
      name: 'Outside the Fence',
      desc: `You stand outside the fence of the abandoned nuclear power plant. You can see the cooling tower against the night sky.`,
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
      desc: `You stand in the dark woods. Which direction was it back?`,
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
            }
          }
        },
        {
          id: 'boltcutters',
          name: 'Boltcutters',
          desc: `A pair of bultcutters, could come in handy.`,
          isHidden: true,
          isTakeable: false,
          onUse: () => {
            if (disk.roomId === 'outside_fence') {
              println("You cut a hole in the fence.")
              unblockExit('outside_fence', 'east')
            }
            if (disk.roomId === 'river') {
              println("You cut the chain with the boltcutters.")
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
      desc: `You are standing in a homeless camp. There is a homeless MAN looking at you from the opposite side of a small fire.`,
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
          desc: 'A simple blanket',
          onLook: () => {
            const blanket = getItemInRoom('blanket', 'homeless_camp')
            if (blanket) {
              if (blanket.isTakeable) {
                println("The MAN nods at you to TAKE it with you.")
              } else {
                println("Tt is wrapped around the MAN's body to keep him warm.")
              }
            } else {
            }
          },
          onUse: () => {
            if (disk.roomId === 'outside_fence') {
              println("You throw the blanket over the barbed wire fence.")
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
      desc: `You are lost in the forest. Which way did you come from?`,
      items: [
        {
          id: 'wood',
          name: 'Wood',
          desc: `Some sticks and branches.`,
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
      desc: `You are in the containment structure. A blueish glow can be seen from DOWN below.`,
      exits: [
        { dir: 'west', id: 'parking_lot', block: `The door is locked with a deadbolt. I would need to USE a KEY to open it.` },
        { dir: 'south', id: 'utility_tunnel' },
        { dir: 'down', id: 'reactor' },
      ],
    },
    {
      id: 'intake_structure',
      name: 'Intake Structure',
      desc: `You are in the water intake structure of the nuclear power plant.`,
      exits: [
        { dir: 'north', id: 'utility_tunnel' },
        { dir: 'west', id: 'river' }
      ],
    },
    {
      id: 'security_office',
      name: 'Security Office',
      desc: `You are in the main security office for the power plant.`,
      exits: [
        { dir: 'east', id: 'utility_tunnel' },
        { dir: 'south', id: 'parking_lot' }
      ],
    },
    {
      id: 'reactor',
      name: 'Reactor Core',
      desc: `You are just above the reactor core pool.`,
      exits: [
        { dir: 'up', id: 'containment' },
      ],
    },
    {
      id: 'utility_tunnel',
      name: 'Utility Tunnel',
      desc: `You are in a utility tunnel.`,
      exits: [
        { dir: 'north', id: 'containment' },
        { dir: 'south', id: 'intake_structure' },
        { dir: 'east', id: 'security_office' },
      ],
    },
    {
      id: 'parking_lot',
      name: 'Parking Lot',
      desc: `You are in the parking lot of the nuclear power plant. There are a few broken down cars here, their owners long gone.`,
      exits: [
        { dir: 'west', id: 'outside_fence' },
        { dir: 'east', id: 'containment', block: `The door is locked with a deadbolt, I would need to USE a KEY to get in.` },
        { dir: 'south', id: 'river' },
        { dir: 'north', id: 'security_office' },
      ],
    },
    {
      id: 'river',
      name: 'River',
      desc: `You stand on the banks of a wide river. The water here is warm. A utility tunnel leads EAST towards the intake structure.`,
      exits: [
        { dir: 'north', id: 'parking_lot' },
        { dir: 'east', id: 'intake_structure', block: `The tunnel is locked with a chain and padlock.` }
      ],
    },
  ],


  /**
   *  CHARACTERS
   */
  characters: [
    {
      name: ['walter', 'roommate'],
      roomId: 'living_room',
      desc: 'Walter looks zoned out watching the TV.',
      onTalk: () => println("Hey man, weren't you going to scope out that abandoned nuclear power plant?"),
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
        if (getRoom('homeless_camp').isHappy) {
          println("Hello, my name is SAM. You aren't the first one through here recently. What can I help you with?")
        } else {
          println(`The homeless man remains silent, with a frown on his face. Finally, he says "Got any spare change?"`)
        }
      },
      topics: []
    },
  ],
});

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
