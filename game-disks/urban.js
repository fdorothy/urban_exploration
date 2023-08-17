const urbanDisk = () => ({
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
      exits: [
        { dir: 'west', id: 'living_room' },
      ],
    }
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
