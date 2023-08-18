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
            enterRoom('outside_fence')
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
      id: 'outside_fence',
      name: 'Outside the Fence',
      desc: `You stand outside the fence of the abandoned nuclear power plant. You can see the cooling tower against the night sky.`,
      exits: [
        { dir: 'north', id: 'homeless_camp' },
        { dir: 'east', id: 'parking_lot'}//, block: `You cannot scale the barbed wire fence` },
      ],
    },
    {
      id: 'homeless_camp',
      name: 'Homeless Camp',
      desc: `You are standing in a homeless camp. There is a homeless MAN looking at you from the opposite side of a small fire.`,
      exits: [
        { dir: 'south', id: 'outside_fence' },
        { dir: 'north', id: 'forest' },
      ],
    },
    {
      id: 'forest',
      name: 'The Forest',
      desc: `You are lost in the forest. Which way did you come from?`,
      exits: [
        { dir: 'north', id: 'forest' },
        { dir: 'east', id: 'forest' },
        { dir: 'south', id: 'homeless_camp' },
        { dir: 'west', id: 'forest' },
      ]
    },
    {
      id: 'parking_lot',
      name: 'Parking Lot',
      desc: `You are in the parking lot of the nuclear power plant. There are a few broken down cars here, their owners long gone.`,
      exits: [
        { dir: 'west', id: 'outside_fence' },
        { dir: 'east', id: 'containment' },
        { dir: 'south', id: 'river' },
        { dir: 'north', id: 'security_office' },
      ],
    },
    {
      id: 'river',
      name: 'River',
      desc: `You stand on the banks of a wide river. The water here is warm. A channel of water flows towards the power plant.`,
      exits: [
        { dir: 'north', id: 'intake_structure' },
        { dir: 'west', id: 'parking_lot' }
      ],
    },


    /**
     * ACT 3 - Inside power plant
     */
    {
      id: 'containment',
      name: 'Containment Structure',
      desc: `You are in the containment structure. A blueish glow can be seen from DOWN below.`,
      exits: [
        { dir: 'west', id: 'parking_lot' },
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
        { dir: 'south', id: 'river' }
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
  ],
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
  ],
});

const unhideItem = (itemId, desc) => {
  const item = getItemInRoom(itemId, disk.roomId)
  if (item && item.isHidden) {
    println(desc)
    item.isHidden = false
  }
}
